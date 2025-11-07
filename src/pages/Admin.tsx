import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Admin = () => {
  const [users, setUsers] = useState<UserLoginStats[]>([]);
  const [userDetails, setUserDetails] = useState<Record<string, UserDetails>>({});
  const [loginEvents, setLoginEvents] = useState<LoginEvent[]>([]);
  const [reviews, setReviews] = useState<ReviewActivity[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data when component mounts
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [usersRes, loginEventsRes, reviewsRes, summaryRes] = await Promise.all([
          fetch("/api/stats/users"),
          fetch("/api/stats/login-events"),
          fetch("/api/stats/reviews"),
          fetch("/api/stats/summary"),
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
            const res = await fetch(`/user/${user.userId}`);
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead>Total connexions</TableHead>
                  <TableHead>Moyenne jours entre connexions</TableHead>
                  <TableHead>Status</TableHead>
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
          <Card className="p-4">
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;