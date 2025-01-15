import "./assets/App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/Home";
import AdPage from "./pages/Ad";
import CategoryPage from "./pages/Category";
import AdFormPage from "./pages/AdForm";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
    uri: "http://localhost:5000/",
    cache: new InMemoryCache(),
});

function App() {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="ads/:id" element={<AdPage />} />
                        <Route
                            path="categories/:id"
                            element={<CategoryPage />}
                        />
                        <Route path="/ads/:id/edit" element={<AdFormPage />} />
                        <Route path="ads/newAd" element={<AdFormPage />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ApolloProvider>
    );
}

export default App;
