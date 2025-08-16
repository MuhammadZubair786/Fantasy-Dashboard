import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import dayjs from "dayjs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../service/firebase-config";

const formatDate = (timestamp) =>
  dayjs.unix(timestamp.seconds).format("YYYY-MM-DD");

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [company, setcompany] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const CompanySnapshot = await getDocs(collection(db, "Company"));
      const requestsSnapshot = await getDocs(collection(db, "requests"));

      const usersData = usersSnapshot.docs.map((doc) => doc.data());
      const companyData = CompanySnapshot.docs.map((doc) => doc.data());
      const requestsData = requestsSnapshot.docs.map((doc) => doc.data());

      setUsers(usersData);
      setRequests(requestsData);
      setcompany(companyData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const totalUsers = users.filter((u) => u.userType === "User").length;
  const totalCompanies = company.filter((u) => u.userType === "Company").length;
  const blocked = users.filter((u) => u.isBlocked).length;
  const active = users.length - blocked;

  const getMonthlyCounts = () => {
    const counts = {};
    users.forEach((u) => {
      const month = dayjs.unix(u.createdAt.seconds).format("MMM YYYY");
      counts[month] = (counts[month] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, Users: count }));
  };

  const getCompanyMonthlyCounts = () => {
    const counts = {};
    company.forEach((u) => {
      const month = dayjs.unix(u.createdAt.seconds).format("MMM YYYY");
      counts[month] = (counts[month] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, Companies: count }));
  };

  const getDailyServiceCounts = () => {
    const counts = {};
    requests.forEach((r) => {
      const day = dayjs.unix(r.timestamp?.seconds).format("YYYY-MM-DD");
      counts[day] = (counts[day] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, Services: count }));
  };

  const monthlyUserData = getMonthlyCounts();
  const monthlyCompanyData = getCompanyMonthlyCounts();
  const combinedMonthlyData = monthlyUserData.map((entry) => {
    const companyMatch = monthlyCompanyData.find((e) => e.name === entry.name);
    return {
      name: entry.name,
      Users: entry.Users,
      Companies: companyMatch?.Companies || 0,
    };
  });

  const dailyServices = getDailyServiceCounts();

  const pieData = [
    { name: "Users", value: totalUsers },
    { name: "Companies", value: totalCompanies },
  ];

  const COLORS = ["#1e88e5", "#43a047"];

  if (loading)
    return (
      <Box p={5} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
      {[
  ["Total Users", totalUsers, "#1e88e5"],
  ["Companies", totalCompanies, "#43a047"],
  ["Active", active, "#ffa000"],
  ["Blocked", blocked, "#e53935"],
].map(
          ([label, value, color]) => (
            <Grid item xs={12} sm={6} md={3} key={label}>
              <Card
                sx={{
                  borderRadius: 4,
                  boxShadow: 6,
                  background: color,
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{label}</Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        )}
      </Grid>
      <Box mt={6}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          User vs Company Distribution
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box mt={6}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Monthly Growth (Users vs Companies)
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={combinedMonthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" />
            <Bar dataKey="Users" fill="#1e88e5" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Companies" fill="#43a047" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Box mt={6}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Daily Service Requests
        </Typography>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={dailyServices} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Services" stroke="#e53935" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      
    </Box>
  );
}