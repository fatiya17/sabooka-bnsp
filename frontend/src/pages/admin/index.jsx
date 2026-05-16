import React, { useEffect, useState } from 'react';
import { getBooks } from '../../_services/books';
import { getAuthors } from '../../_services/authors';
import { getTransactions } from '../../_services/transactions';
import { getUsers } from '../../_services/users';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [stats, setStats] = useState({
        books: 0,
        authors: 0,
        sales: 0,
        users: 0,
        transStatus: {
            pending: 0,
            shipped: 0,
            completed: 0,
            paid: 0
        },
        recentUsers: [],
        dailySales: [],
        dailyPercentages: [],
        monthlyPoints: "",
        monthLabels: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [booksData, authorsData, transactionsData, usersData] = await Promise.all([
                    getBooks(),
                    getAuthors(),
                    getTransactions(),
                    getUsers()
                ]);

                const validStatuses = ['PAID', 'PROCESSING', 'SHIPPED', 'COMPLETED'];
                
                // Calculate total sales only for COMPLETED transactions
                const totalSales = transactionsData.data?.filter(t => t.status === 'COMPLETED').reduce((acc, curr) => acc + Number(curr.amount || 0), 0) || 0;

                // Status counts
                const statusCounts = { pending: 0, shipped: 0, completed: 0, paid: 0 };
                transactionsData.data?.forEach(t => {
                    if (t.status === 'PENDING') statusCounts.pending++;
                    else if (t.status === 'SHIPPED') statusCounts.shipped++;
                    else if (t.status === 'COMPLETED') statusCounts.completed++;
                    else if (t.status === 'PAID') statusCounts.paid++;
                });

                // Get 4 most recent users
                const recent = usersData.data?.slice(0, 4) || [];

                // Chart Data Calculations
                // 1. Daily Sales (Last 7 days)
                const last7Days = Array.from({length: 7}).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                }).reverse();

                const dailySalesData = last7Days.map(date => {
                    const dayTrans = transactionsData.data?.filter(t => t.created_at.startsWith(date) && t.status === 'COMPLETED') || [];
                    return dayTrans.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
                });
                const maxDaily = Math.max(...dailySalesData, 1);
                const dailyPct = dailySalesData.map(s => (s / maxDaily) * 100);

                // 2. Historical Sales (Last 6 months)
                const last6Months = Array.from({length: 6}).map((_, i) => {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    return { month: d.getMonth() + 1, year: d.getFullYear(), label: d.toLocaleString('en-US', { month: 'short' }) };
                }).reverse();

                const monthlySalesData = last6Months.map(m => {
                    const monthStr = `${m.year}-${m.month.toString().padStart(2, '0')}`;
                    const monthTrans = transactionsData.data?.filter(t => t.created_at.startsWith(monthStr) && t.status === 'COMPLETED') || [];
                    return monthTrans.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
                });
                const maxMonthly = Math.max(...monthlySalesData, 1);
                // Map values to a 100x40 coordinate space (y is inverted in SVG, 0 is top)
                const points = monthlySalesData.map((val, i) => {
                    const x = (i / 5) * 100;
                    const y = 35 - ((val / maxMonthly) * 30); // Max height 30, offset from bottom 5
                    return `${x},${y}`;
                }).join(' ');


                setStats({
                    books: booksData.data?.length || 0,
                    authors: authorsData.data?.length || 0,
                    sales: totalSales,
                    users: usersData.data?.length || 0,
                    transStatus: statusCounts,
                    recentUsers: recent,
                    dailySales: dailySalesData,
                    dailyPercentages: dailyPct,
                    monthlyPoints: points,
                    monthLabels: last6Months.map(m => m.label)
                });
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (val) => {
        return `Rp. ${Number(val).toLocaleString('id-ID')}`;
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Top Row: Simple White Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Recent Customers */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/5 flex flex-col justify-between h-36">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-black text-sm">Recent Customers</h3>
                        <span className="text-black/30">...</span>
                    </div>
                    <div className="flex items-center gap-2 mt-auto">
                        {stats.recentUsers.map((u, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <img 
                                    src={`https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(u.name)}&backgroundColor=transparent`}
                                    alt={u.name}
                                    className="w-10 h-10 rounded-xl bg-[#A3D1E4]/20 object-cover mb-1 shrink-0"
                                />
                                <span className="text-[10px] text-black/60 truncate w-10 text-center">{u.name.split(' ')[0]}</span>
                            </div>
                        ))}
                        {stats.recentUsers.length === 0 && (
                            <p className="text-xs text-black/40">No recent users.</p>
                        )}
                    </div>
                </div>

                {/* Card 2: Total Users Overview */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/5 flex flex-col justify-between h-36 relative overflow-hidden">
                    <h3 className="font-bold text-black text-sm">User Overview</h3>
                    <div className="mt-auto">
                        <p className="text-xs text-black/50 mb-1">Total Registered Users</p>
                        <p className="text-3xl font-black text-black">{stats.users}</p>
                    </div>
                    <div className="absolute right-4 bottom-4 flex items-end gap-1 opacity-20">
                        <div className="w-2 h-8 bg-[#FB8B4B] rounded-full"></div>
                        <div className="w-2 h-12 bg-[#FB8B4B] rounded-full"></div>
                        <div className="w-2 h-6 bg-[#FB8B4B] rounded-full"></div>
                        <div className="w-2 h-14 bg-[#FB8B4B] rounded-full"></div>
                    </div>
                </div>

                {/* Card 3: Store Overview */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/5 flex flex-col justify-between h-36">
                    <h3 className="font-bold text-black text-sm">Store Overview</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="text-xs text-black/50">Total Books in Store</p>
                        <p className="font-black text-sm">{stats.books}</p>
                    </div>
                    <Link to="/admin/books" className="mt-auto bg-[#A3D1E4]/20 text-black px-4 py-2 rounded-xl text-xs font-bold text-center hover:bg-[#A3D1E4]/40 transition-colors">
                        Add New Book
                    </Link>
                </div>
            </div>

            {/* Middle Row: Colorful Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Large Colorful Card: Revenue */}
                <div className="lg:col-span-6 bg-[#FB8B4B] rounded-[24px] p-8 text-white flex flex-col justify-between shadow-lg shadow-[#FB8B4B]/20 relative overflow-hidden h-64">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <p className="text-white/80 text-sm font-light mb-2">Total Revenue</p>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter truncate" title={formatCurrency(stats.sales)}>{formatCurrency(stats.sales)}</h2>
                    </div>
                    <div className="relative z-10 flex gap-4 sm:gap-8 mt-auto border-t border-white/20 pt-6">
                        <div>
                            <p className="text-white/70 text-[10px] uppercase tracking-wider mb-1">Paid</p>
                            <p className="font-black text-xl">{stats.transStatus.paid}</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-[10px] uppercase tracking-wider mb-1">Shipped</p>
                            <p className="font-black text-xl">{stats.transStatus.shipped}</p>
                        </div>
                        <div>
                            <p className="text-white/70 text-[10px] uppercase tracking-wider mb-1">Completed</p>
                            <p className="font-black text-xl">{stats.transStatus.completed}</p>
                        </div>
                    </div>
                </div>

                {/* Vertical Small Card 1: Books */}
                <div className="lg:col-span-3 bg-[#A3D1E4] rounded-[24px] p-6 flex flex-col justify-center items-center text-black text-center shadow-lg shadow-[#A3D1E4]/20 h-64">
                    <p className="text-black/60 text-sm mb-4 font-light">Available Books</p>
                    <h3 className="text-6xl font-black">{stats.books}</h3>
                    <p className="mt-6 text-xs font-bold text-black/40 uppercase tracking-widest bg-white/30 px-3 py-1 rounded-full">In System</p>
                </div>

                {/* Vertical Small Card 2: Authors */}
                <div className="lg:col-span-3 bg-[#D1B3FF] rounded-[24px] p-6 flex flex-col justify-center items-center text-black text-center shadow-lg shadow-[#D1B3FF]/20 h-64">
                    <p className="text-black/60 text-sm mb-4 font-light">Registered Authors</p>
                    <h3 className="text-6xl font-black">{stats.authors}</h3>
                    <p className="mt-6 text-xs font-bold text-black/40 uppercase tracking-widest bg-white/30 px-3 py-1 rounded-full">Active</p>
                </div>
            </div>

            {/* Bottom Row: Static Chart Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-sm min-h-[300px] flex flex-col">
                    <h3 className="font-bold text-black text-sm mb-2">Historical Sales Stat</h3>
                    <p className="text-xs text-black/40 mb-4">Last 6 Months</p>
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 w-full relative">
                            {/* Real Line Chart SVG */}
                            <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                                <polyline 
                                    points={stats.monthlyPoints} 
                                    fill="none" 
                                    stroke="#FB8B4B" 
                                    strokeWidth="1.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                />
                            </svg>
                        </div>
                        {/* Month Labels */}
                        <div className="flex justify-between mt-4 text-[10px] text-black/40 font-bold uppercase">
                            {stats.monthLabels.map((lbl, idx) => <span key={idx}>{lbl}</span>)}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 border border-black/5 shadow-sm min-h-[300px] flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="font-bold text-black text-sm mb-2">Daily Sales Summary</h3>
                            <p className="text-xs text-black/40">From Last 7 Days</p>
                        </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-3 px-4 pb-4">
                        {/* Real Bar Chart */}
                        {stats.dailyPercentages.map((pct, i) => (
                            <div key={i} className={`w-full rounded-t-sm transition-all ${pct === 100 ? 'bg-[#FB8B4B] relative' : 'bg-[#A3D1E4]/40'}`} style={{height: `${Math.max(pct, 5)}%`}}>
                                {pct === 100 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#FB8B4B]">Peak</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}