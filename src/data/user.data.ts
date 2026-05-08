// data/users.data.ts

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  location: string;
  joinedAt: string;
  avatar?: string;
};

export const usersData: User[] = [
  { id: 1,  name: "Aarav Sharma",    email: "aarav@example.com",    phone: "+91 98765 43210", role: "Admin",     status: "active",   location: "Mumbai",    joinedAt: "2024-01-15" },
  { id: 2,  name: "Priya Verma",     email: "priya@example.com",    phone: "+91 91234 56789", role: "Manager",   status: "active",   location: "Delhi",     joinedAt: "2024-02-20" },
  { id: 3,  name: "Rohit Mehta",     email: "rohit@example.com",    phone: "+91 99887 76655", role: "Sales", status: "inactive", location: "Bangalore", joinedAt: "2024-03-10" },
  { id: 4,  name: "Sneha Patel",     email: "sneha@example.com",    phone: "+91 87654 32109", role: "Sales",    status: "active",   location: "Ahmedabad", joinedAt: "2024-03-25" },
  { id: 5,  name: "Karan Singh",     email: "karan@example.com",    phone: "+91 76543 21098", role: "Manager",   status: "active",   location: "Pune",      joinedAt: "2024-04-05" },
  { id: 6,  name: "Anjali Gupta",    email: "anjali@example.com",   phone: "+91 65432 10987", role: "Sales", status: "inactive", location: "Hyderabad", joinedAt: "2024-04-18" },
  { id: 7,  name: "Vikas Joshi",     email: "vikas@example.com",    phone: "+91 54321 09876", role: "Sales",    status: "active",   location: "Chennai",   joinedAt: "2024-05-01" },
  { id: 8,  name: "Pooja Yadav",     email: "pooja@example.com",    phone: "+91 43210 98765", role: "Admin",     status: "active",   location: "Kolkata",   joinedAt: "2024-05-14" },
  { id: 9,  name: "Arjun Nair",      email: "arjun@example.com",    phone: "+91 32109 87654", role: "Sales", status: "active",   location: "Kochi",     joinedAt: "2024-06-02" },
  { id: 10, name: "Divya Reddy",     email: "divya@example.com",    phone: "+91 21098 76543", role: "Manager",   status: "inactive", location: "Indore",    joinedAt: "2024-06-20" },
  { id: 11, name: "Manish Tiwari",   email: "manish@example.com",   phone: "+91 11223 44556", role: "Sales",    status: "active",   location: "Jaipur",    joinedAt: "2024-07-08" },
  { id: 12, name: "Ritu Agarwal",    email: "ritu@example.com",     phone: "+91 99001 12233", role: "Manager", status: "active",   location: "Lucknow",   joinedAt: "2024-07-22" },
];