import { useState, useEffect } from 'react';
import { coursesAPI, purchasesAPI, progressAPI } from '../../utils/api';
import { useTheme } from '../../context/ThemeContext';
import { FiTrendingUp, FiUsers, FiDollarSign, FiBook, FiActivity } from 'react-icons/fi';

const AdminAnalytics = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalCourses: 0,
    totalStudents: 0,
    monthlyRevenue: 0,
    monthlyEnrollments: 0,
    averageProgress: 0
  });
  const [recentPurchases, setRecentPurchases] = useState([]);
  const [courseStats, setCourseStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [coursesRes, purchasesRes] = await Promise.all([
        coursesAPI.getAllAdmin(),
        purchasesAPI.getAllPurchases()
      ]);

      const courses = coursesRes.data.courses;
      const purchases = purchasesRes.data.purchases;

      // Calculate stats
      const totalRevenue = purchases.reduce(
        (sum, p) => sum + parseFloat(p.amount || 0),
        0
      );

      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyPurchases = purchases.filter(
        p => new Date(p.purchased_at) >= thisMonth
      );
      const monthlyRevenue = monthlyPurchases.reduce(
        (sum, p) => sum + parseFloat(p.amount || 0),
        0
      );

      // Calculate course statistics
      const courseStatsData = courses.map(course => {
        const coursePurchases = purchases.filter(p => p.course_id === course.id);
        const revenue = coursePurchases.reduce(
          (sum, p) => sum + parseFloat(p.amount || 0),
          0
        );
        return {
          id: course.id,
          title: course.title,
          enrollments: coursePurchases.length,
          revenue
        };
      }).sort((a, b) => b.revenue - a.revenue);

      setStats({
        totalRevenue,
        totalCourses: courses.length,
        totalStudents: new Set(purchases.map(p => p.user_id)).size,
        monthlyRevenue,
        monthlyEnrollments: monthlyPurchases.length,
        averageProgress: 0 // Can be enhanced with actual progress data
      });

      setRecentPurchases(purchases.slice(0, 10));
      setCourseStats(courseStatsData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-xl border-2 p-6 ${
          theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-electric-blue/20 text-electric-blue' : 'bg-accent-red/20 text-accent-red'
            }`}>
              <FiDollarSign size={24} />
            </div>
          </div>
          <h3 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Revenue
          </h3>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            ₹{stats.totalRevenue.toLocaleString()}
          </p>
          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            All time earnings
          </p>
        </div>

        <div className={`rounded-xl border-2 p-6 ${
          theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-electric-blue/20 text-electric-blue' : 'bg-accent-red/20 text-accent-red'
            }`}>
              <FiBook size={24} />
            </div>
          </div>
          <h3 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Courses
          </h3>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {stats.totalCourses}
          </p>
          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Active courses
          </p>
        </div>

        <div className={`rounded-xl border-2 p-6 ${
          theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-electric-blue/20 text-electric-blue' : 'bg-accent-red/20 text-accent-red'
            }`}>
              <FiUsers size={24} />
            </div>
          </div>
          <h3 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Students
          </h3>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {stats.totalStudents}
          </p>
          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            Unique enrollments
          </p>
        </div>

        <div className={`rounded-xl border-2 p-6 ${
          theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${
              theme === 'dark' ? 'bg-electric-blue/20 text-electric-blue' : 'bg-accent-red/20 text-accent-red'
            }`}>
              <FiTrendingUp size={24} />
            </div>
          </div>
          <h3 className={`text-sm font-semibold mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Monthly Revenue
          </h3>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            ₹{stats.monthlyRevenue.toLocaleString()}
          </p>
          <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
            {stats.monthlyEnrollments} enrollments this month
          </p>
        </div>
      </div>

      {/* Top Courses by Revenue */}
      <div className={`rounded-xl border-2 p-6 ${
        theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Top Courses by Revenue
        </h3>
        <div className="space-y-3">
          {courseStats.slice(0, 5).map((course, index) => (
            <div
              key={course.id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                theme === 'dark' ? 'bg-dark-lighter' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  theme === 'dark'
                    ? 'bg-electric-green/20 text-electric-green'
                    : 'bg-accent-red/20 text-accent-red'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {course.title}
                  </h4>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {course.enrollments} enrollments
                  </p>
                </div>
              </div>
              <div className={`font-bold ${theme === 'dark' ? 'text-electric-green' : 'text-accent-red'}`}>
                ₹{course.revenue.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className={`rounded-xl border-2 p-6 ${
        theme === 'dark' ? 'bg-dark-card border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Recent Enrollments
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Student
                </th>
                <th className={`text-left py-3 px-4 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Course
                </th>
                <th className={`text-left py-3 px-4 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Amount
                </th>
                <th className={`text-left py-3 px-4 font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentPurchases.map(purchase => (
                <tr
                  key={purchase.id}
                  className={`border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}
                >
                  <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {purchase.user_name}
                  </td>
                  <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {purchase.course_title}
                  </td>
                  <td className={`py-3 px-4 font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    ₹{parseFloat(purchase.amount || 0).toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(purchase.purchased_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

