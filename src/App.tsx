
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WeatherProvider } from "@/contexts/WeatherContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Marketplace from "./pages/Marketplace";
import Community from "./pages/Community";
import AddProduct from "./pages/AddProduct";
import MyProducts from "./pages/MyProducts";
import { Toaster } from "@/components/ui/toaster";
import EditProduct from "./pages/EditProduct";
import Resources from "./pages/Resources";
import AddResource from "./pages/AddResource";
import EditResource from "./pages/EditResource";
import MyResources from "./pages/MyResources";
import ReceivedRequests from "./pages/ReceivedRequests";
import Weather from "./pages/Weather";
import Profile from "./pages/Profile";
import Diagnosis from "./pages/Diagnosis";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <WeatherProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/community" element={<Community />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/my-products" element={<MyProducts />} />
              <Route path="/edit-product/:id" element={<EditProduct />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/add-resource" element={<AddResource />} />
              <Route path="/edit-resource/:id" element={<EditResource />} />
              <Route path="/my-resources" element={<MyResources />} />
              <Route path="/diagnosis" element={<Diagnosis />} />
              <Route path="/requests" element={<ReceivedRequests />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </WeatherProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
