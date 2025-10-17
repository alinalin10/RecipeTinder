import { BrowserRouter, Routes, Route } from 'react-router-dom'

//pages & components

function App() {
    return (
        <div className="App">
            <BrowserRouter>
            <Navbar />
            <div className="pages">
                <Routes>
                    <Route
                    path="/"
                    element={<Home />}
                    />
                    <Route
                    path="/"
                    element={<Signup />}
                    />
                    <Route
                    path="/"
                    element={< Login />}
                    />
                </Routes>
            </div>
            </BrowserRouter>
        </div>
    )
}