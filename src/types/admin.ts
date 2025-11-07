export interface UserLoginStats {
    userId: string;
    totalLogins: number;
    lastLoginAt: string;
    firstLoginAt: string;
    avgDaysBetweenLogins: number;
    updatedAt: string;
}

export interface LoginEvent {
    userId: string;
    timestamp: string;
    type: string;
}

export interface ReviewActivity {
    userId: string;
    bookId: string;
    timestamp: string;
    action: string;
}

export interface Summary {
    nbUsers: number;
    nbLogins: number;
    nbReviews: number;
    nbLikes: number;
}


export interface UserDetails {
    id: string;
    email: string;
    name: string;
    picture: string;
    provider: string;
    providerId: string;
    emailVerified: boolean;
    roles: string;
    createdAt: string;
    lastLoginAt: string;
    updatedAt: string;
    isActive: boolean;
}