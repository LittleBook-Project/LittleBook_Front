import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserLoginStats, LoginEvent, ReviewActivity, Summary, UserDetails } from "@/types/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import ReviewDialog from "@/components/ReviewDialog";
import { Review } from "@/types/review";
import { Input } from "@/components/ui/input";
import { Trash2, Edit } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ArcElement } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.register(ArcElement);

const Admin = () => {
  const [users, setUsers] = useState<UserLoginStats[]>([]);
  const [userDetails, setUserDetails] = useState<Record<string, UserDetails>>({});
  const [loginEvents, setLoginEvents] = useState<LoginEvent[]>([]);
  const [reviews, setReviews] = useState<ReviewActivity[]>([]);
  const [moderationResults, setModerationResults] = useState<Review[]>([]);
  const [moderationLoading, setModerationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<'isbn' | 'user'>('isbn');
  const [modDialogOpen, setModDialogOpen] = useState(false);
  const [modEditingReview, setModEditingReview] = useState<Review | null>(null);
  const [modEditingBookTitle, setModEditingBookTitle] = useState("");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const ADMIN_BASE = ((import.meta as any).env?.VITE_ADMIN_BASE as string) || "";
  const USER_BASE = ((import.meta as any).env?.VITE_USER_BASE as string) || "";
  const USE_RELATIVE = ((import.meta as any).env?.VITE_USE_RELATIVE_API as string) === "true";

  console.debug("Admin config => ADMIN_BASE:", ADMIN_BASE, "USER_BASE:", USER_BASE, "USE_RELATIVE:", USE_RELATIVE);

  const adminUrl = (path: string) => {
    // path should start with '/'
    const fullPath = `/api${path}`;
    if (USE_RELATIVE) return fullPath;
    return ADMIN_BASE ? `${ADMIN_BASE}${fullPath}` : fullPath;
  };

  const userUrl = (path: string) => {
    const fullPath = `/api${path}`;
    if (USE_RELATIVE) return fullPath;
    return USER_BASE ? `${USER_BASE}${fullPath}` : fullPath;
  };

  useEffect(() => {
    // Fetch data when component mounts
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [usersRes, loginEventsRes, reviewsRes, summaryRes] = await Promise.all([
          fetch(adminUrl('/stats/users')),
          fetch(adminUrl('/stats/login-events')),
          fetch(adminUrl('/stats/reviews')),
          fetch(adminUrl('/stats/summary')),
        ]);

        // Vérification des réponses
        if (!usersRes.ok || !loginEventsRes.ok || !reviewsRes.ok || !summaryRes.ok) {
          throw new Error('Une ou plusieurs requêtes ont échoué');
        }

        const usersData = await usersRes.json();
        const loginEventsData = await loginEventsRes.json();
        const reviewsData = await reviewsRes.json();
        const summaryData = await summaryRes.json();

        // Récupération des détails des utilisateurs
        const userDetailsPromises = usersData.map(async (user: UserLoginStats) => {
          try {
            const res = await fetch(userUrl(`/user/${user.userId}`));
            if (res.ok) {
              return [user.userId, await res.json()];
            }
          } catch (error) {
            console.error(`Erreur lors de la récupération des détails de l'utilisateur ${user.userId}:`, error);
          }
          return null;
        });

        const userDetailsResults = await Promise.all(userDetailsPromises);
        const userDetailsMap = Object.fromEntries(
          userDetailsResults.filter(Boolean) as [string, UserDetails][]
        );

        setUsers(usersData);
        setUserDetails(userDetailsMap);
        setLoginEvents(loginEventsData);
        setReviews(reviewsData);
        setSummary(summaryData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "Une erreur est survenue lors du chargement des données");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return format(parseISO(dateString), "dd/MM/yyyy HH:mm");
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Date invalide";
    }
  };

  const fetchModerationByIsbn = async (isbn: string) => {
    setModerationLoading(true);
    try {
      const res = await fetch(adminUrl(`/reviews/book/${encodeURIComponent(isbn)}`), { credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      const data: Review[] = await res.json();
      setModerationResults(data);
    } catch (e) {
      console.error(e);
      setModerationResults([]);
    } finally {
      setModerationLoading(false);
    }
  };

  const fetchModerationByUser = async (userUuid: string) => {
    setModerationLoading(true);
    try {
      const res = await fetch(adminUrl(`/reviews/user/${encodeURIComponent(userUuid)}`), { credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      const data: Review[] = await res.json();
      setModerationResults(data);
    } catch (e) {
      console.error(e);
      setModerationResults([]);
    } finally {
      setModerationLoading(false);
    }
  };

  const openModEdit = async (r: Review) => {
    // try to load book title
    let title = r.bookIsbn;
    try {
      const bres = await fetch(adminUrl(`/book?isbn=${encodeURIComponent(r.bookIsbn)}&page=0&size=1`), { credentials: 'include' });
      if (bres.ok) {
        const j = await bres.json();
        title = j.content?.[0]?.title || title;
      }
    } catch (e) {
      // ignore
    }
    setModEditingBookTitle(title);
    setModEditingReview(r);
    setModDialogOpen(true);
  };

  const modDelete = async (r: Review) => {
    if (!confirm('Supprimer cet avis ?')) return;
    try {
      const res = await fetch(adminUrl(`/reviews/${r.id}?userUuid=${encodeURIComponent(r.userUuid || '')}`), { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      setModerationResults(prev => prev.filter(x => x.id !== r.id));
      alert('Avis supprimé');
    } catch (e) {
      console.error(e);
      alert('Erreur suppression');
    }
  };

  const loginChartData = {
    labels: loginEvents.map((event) => 
      event.timestamp ? format(parseISO(event.timestamp), "dd/MM HH:mm") : "N/A"
    ),
    datasets: [
      {
        label: "Connexions",
        data: loginEvents.map((_, index) => index + 1),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Pie chart: actifs vs inactifs
  const activeCount = Object.values(userDetails).filter(u => u?.isActive).length;
  const inactiveCount = Object.values(userDetails).filter(u => u && !u.isActive).length;
  const activeChartData = {
    labels: ['Actifs', 'Inactifs'],
    datasets: [{
      data: [activeCount, inactiveCount],
      backgroundColor: ['#34D399', '#FCA5A5'],
    }]
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord administrateur</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Utilisateurs totaux</h3>
            <p className="text-2xl">{summary.nbUsers}</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Connexions totales</h3>
            <p className="text-2xl">{summary.nbLogins}</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Avis totaux</h3>
            <p className="text-2xl">{summary.nbReviews}</p>
          </Card>
          <Card className="p-4">
            <h3 className="font-semibold mb-2">J'aime totaux</h3>
            <p className="text-2xl">{summary.nbLikes}</p>
          </Card>
        </div>
      )}

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="logins">Connexions</TabsTrigger>
          <TabsTrigger value="reviews">Avis</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="p-4">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <h4 className="font-semibold mb-2">Statut utilisateurs</h4>
                <div className="h-40">
                  <Pie data={activeChartData} />
                </div>
              </div>
              <div className="md:col-span-2">
                {/* Table principal */}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead>Total connexions</TableHead>
                  <TableHead>Moyenne jours entre connexions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const details = userDetails[user.userId];
                  return (
                    <TableRow key={user.userId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {details?.picture && (
                            <img 
                              src={details.picture} 
                              alt={details.name} 
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          {details?.name || "Inconnu"}
                        </div>
                      </TableCell>
                      <TableCell>{details?.email || "N/A"}</TableCell>
                      <TableCell>
                        {formatDate(user.lastLoginAt)}
                      </TableCell>
                      <TableCell>{user.totalLogins}</TableCell>
                      <TableCell>{user.avgDaysBetweenLogins.toFixed(1)} jours</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${details?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {details?.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                            onClick={async () => {
                              const name = window.prompt('Nouveau nom', details?.name || '');
                              if (name === null) return;
                              const roles = window.prompt('Roles (virgule séparés)', details?.roles || 'ROLE_USER');
                              try {
                                const resp = await fetch(userUrl(`/user/${user.userId}`), {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json' },
                                  credentials: 'include',
                                  body: JSON.stringify({ name, roles })
                                });
                                if (!resp.ok) {
                                  alert('Erreur mise à jour: ' + await resp.text());
                                  return;
                                }
                                const updated = await fetch(userUrl(`/user/${user.userId}`));
                                if (updated.ok) {
                                  const js = await updated.json();
                                  setUserDetails(prev => ({ ...prev, [user.userId]: js }));
                                }
                                alert('Utilisateur mis à jour');
                              } catch (e) {
                                console.error(e);
                                alert('Erreur réseau lors de la mise à jour');
                              }
                            }}
                          >
                            Éditer
                          </button>
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                            onClick={async () => {
                              if (!confirm('Désactiver cet utilisateur ?')) return;
                              try {
                                const resp = await fetch(userUrl(`/user/${user.userId}`), {
                                  method: 'DELETE',
                                  credentials: 'include'
                                });
                                if (!resp.ok) { alert('Erreur suppression: ' + await resp.text()); return; }
                                // refresh details
                                const updated = await fetch(userUrl(`/user/${user.userId}`));
                                if (updated.ok) {
                                  const js = await updated.json();
                                  setUserDetails(prev => ({ ...prev, [user.userId]: js }));
                                } else {
                                  // user may be gone; remove from map
                                  setUserDetails(prev => { const copy = { ...prev }; delete copy[user.userId]; return copy; });
                                }
                                alert('Utilisateur désactivé');
                              } catch (e) {
                                console.error(e);
                                alert('Erreur réseau lors de la désactivation');
                              }
                            }}
                          >
                            Désactiver
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="logins">
          <Card className="p-4">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Graphique des connexions</h3>
              <div className="h-[300px]">
                <Line data={loginChartData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>ID Utilisateur</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loginEvents.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(event.timestamp)}</TableCell>
                    <TableCell>{event.userId}</TableCell>
                    <TableCell>{event.type}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <Card className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <select className="input" value={searchMode} onChange={(e) => setSearchMode(e.target.value as 'isbn' | 'user')}>
                <option value="isbn">Par ISBN</option>
                <option value="user">Par UUID utilisateur</option>
              </select>
              <Input placeholder={searchMode === 'isbn' ? 'Saisir ISBN (ex: 978...)' : 'Saisir UUID utilisateur'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <Button onClick={async () => { if (!searchQuery) return; if (searchMode === 'isbn') await fetchModerationByIsbn(searchQuery); else await fetchModerationByUser(searchQuery); }}>Rechercher</Button>
              <Button variant="ghost" onClick={() => { setSearchQuery(''); setModerationResults([]); }}>Réinitialiser</Button>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Résultats de modération</h3>
              {moderationLoading && <p>Chargement...</p>}
              {!moderationLoading && moderationResults.length === 0 && <p className="text-muted-foreground">Aucun avis trouvé. Utilisez la recherche par ISBN ou UUID.</p>}
              {!moderationLoading && moderationResults.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>ISBN</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Commentaire</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {moderationResults.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{String(r.id)}</TableCell>
                        <TableCell>{r.userUuid}</TableCell>
                        <TableCell>{r.bookIsbn}</TableCell>
                        <TableCell>{r.rating}</TableCell>
                        <TableCell className="max-w-md truncate">{r.description}</TableCell>
                        <TableCell>{r.reviewCreationDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <button className="px-2 py-1 bg-blue-500 text-white rounded text-xs" onClick={() => openModEdit(r)}>
                              <Edit className="mr-2 h-3 w-3"/> Éditer
                            </button>
                            <button className="px-2 py-1 bg-red-500 text-white rounded text-xs" onClick={() => modDelete(r)}>
                              <Trash2 className="mr-2 h-3 w-3"/> Supprimer
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Activity log (existing) */}
            <div>
              <h3 className="font-semibold mb-2">Journal d'activité (summary)</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>ID Utilisateur</TableHead>
                    <TableHead>ID Livre</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(review.timestamp)}</TableCell>
                      <TableCell>{review.userId}</TableCell>
                      <TableCell>{review.bookId}</TableCell>
                      <TableCell>{review.action}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          {modEditingReview && (
            <ReviewDialog
              open={modDialogOpen}
              onOpenChange={(v) => { if (!v) setModDialogOpen(false); else setModDialogOpen(v); }}
              bookId={modEditingReview.bookIsbn}
              bookTitle={modEditingBookTitle}
              existingReview={{ id: String(modEditingReview.id), rating: modEditingReview.rating || 0, comment: modEditingReview.description }}
              onReviewSubmitted={async () => {
                setModDialogOpen(false);
                // refresh moderation list
                if (searchMode === 'isbn' && searchQuery) await fetchModerationByIsbn(searchQuery);
                if (searchMode === 'user' && searchQuery) await fetchModerationByUser(searchQuery);
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;