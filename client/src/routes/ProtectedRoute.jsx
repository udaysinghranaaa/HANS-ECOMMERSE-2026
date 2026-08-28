/**
 * Route guard for authenticated and role-based access.
 *
 * Usage (future):
 * <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
 *   <Route path="/cart" element={<CartPage />} />
 * </Route>
 *
 * Authentication and authorization checks will be added when the auth
 * feature module is implemented. No fake authentication is used here.
 */
export default function ProtectedRoute({ children }) {
  return children;
}
