import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PaymentProvider, usePayment } from './context/PaymentContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import PortalHome from './pages/PortalHome';
import Payment from './pages/Payment';

// Imported Features
import CourseLayout from './features/capitalist-course/components/CourseLayout';
import CourseDashboard from './features/capitalist-course/pages/CourseDashboard';
import SessionPage from './features/capitalist-course/pages/SessionPage';

function PaymentGate({ children, courseId }: { children: React.ReactNode, courseId: string }) {
  const { checkAccess } = usePayment();
  if (!checkAccess(courseId)) {
    return <Navigate to={`/payment/${courseId}`} replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PaymentProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Portal Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <PortalHome />
              </ProtectedRoute>
            } />

            <Route path="/payment/:courseId" element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } />

            {/* Capitalist Course Routes (Protected + Paid) */}
            <Route path="/course/capitalist/*" element={
              <ProtectedRoute>
                <PaymentGate courseId="capitalist">
                  <CourseLayout>
                    <Routes>
                      <Route index element={<CourseDashboard />} />
                      <Route path="session/:sessionId" element={<SessionPage />} />
                    </Routes>
                  </CourseLayout>
                </PaymentGate>
              </ProtectedRoute>
            } />
          </Routes>
        </PaymentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
