// import { lazy } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import CityList from "./components/CityList";
import City from "./components/City";
import Form from "./components/Form";
import CountriesList from "./components/CountriesList";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthProvider } from "./contexts/FakeAuthContexts";
import ProtectedRoute from "./pages/ProtectedRoute";
// const Product = lazy(() => import("./pages/Product"));
// const Pricing = lazy(() => import("./pages/Pricing"));
// const HomePage = lazy(() => import("./pages/HomePage"));
// const PageNotFound = lazy(() => import("./pages/PageNotFound"));
// const AppLayout = lazy(() => import("./pages/AppLayout"));
// const Login = lazy(() => import("./pages/Login"));
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import HomePage from "./pages/HomePage";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage />}></Route>
            <Route path="/product" element={<Product />}></Route>
            <Route path="/pricing" element={<Pricing />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route
              path="app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="cities" />} />
              <Route path="cities" element={<CityList></CityList>}></Route>
              <Route path="cities/:id" element={<City></City>}></Route>
              <Route path="countries" element={<CountriesList />}></Route>
              <Route path="form" element={<Form />}></Route>
            </Route>
            <Route path="*" element={<PageNotFound />}></Route>
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
