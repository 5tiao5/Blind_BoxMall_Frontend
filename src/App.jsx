import  { Routes, Route } from 'react-router-dom';
import {Layout} from 'antd';
import LoginPage from './pages/login.jsx';
import RegisterPage from "./pages/register.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import PrivateRoute from './components/PrivateRoute';
import NavBarmy from './pages/NavBar.jsx';
import AdminVerify from "./pages/AdminVerify.jsx";
import CreateProduct from "./pages/CreateProduct.jsx";
import AdminLayout from "./pages/AdminNavbar.jsx";
import ProductManagerPage from "./pages/ProductManagerPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import DrawPage from "./pages/DrawPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import SettlePage from "./pages/SettlePage.jsx";
import SettleMultiPage from "./pages/SettleMultiPage.jsx";
import OrderListPage from "./pages/OrderListPage.jsx";
import PlayerShowList from "./pages/PlayerShowList.jsx";
import PlayerShowCreatePage from "./pages/PlayerShowCreatePage.jsx";
import PlayerShowDetailPage from "./pages/PlayerShowDetailPage.jsx";
import SearchProductPage from "./pages/SearchProductPage.jsx";
const { Header, Content } = Layout;


export default function App() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    return (
        <Layout style={{ background: 'transparent', margin: 0, padding: 0 }}>
            <Header
                className="custom-header"
                style={{ padding: 0, backgroundColor: 'white', boxShadow: 'none' }}
            >
                {isAdmin?<AdminLayout/>:<NavBarmy />}
            </Header>
            <Content style={{ padding: 0 }}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/home"
                           element={
                                <PrivateRoute>
                                    <HomePage/>
                                </PrivateRoute>
                        } />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <UserProfile />
                            </PrivateRoute>
                        }
                    />
                    {/*<Route path="/" element={<div>首页内容</div>} />*/}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/admin-verify" element={<AdminVerify />} />
                    <Route path="/draw/:productId" element={<DrawPage />} />
                    {/* 其他路由保留注释或启用 */}
                    {/*<Route path="/categories" element={<Categories />} />*/}
                    {/*<Route path="/about" element={<About />} />*/}
                    {/*<Route path="/cart" element={<Cart />} />*/}
                    <Route path="create" element={<CreateProduct />} />
                    <Route path="/app" element={<this />} />
                    <Route path="/navbar" element={<NavBarmy />} />
                    <Route path="/product-detail/:productId" element={<ProductDetailPage />} />
                    <Route path="/settle/:orderId" element={<SettlePage />} />
                    <Route path="/settle-multi" element={<SettleMultiPage />} />
                    <Route path="/order/list" element={
                        <PrivateRoute>
                            <OrderListPage />
                        </PrivateRoute>
                    } />
                    <Route path="/playershow" element={
                        <PrivateRoute>
                            <PlayerShowList />
                        </PrivateRoute>
                    } />
                    <Route path="/playershow/create" element={<PlayerShowCreatePage />} />
                    <Route path="/playershow/detail/:id" element={<PlayerShowDetailPage />} />
                    {/*<Route path="/product-create" element={<CreateProduct />} />*/}
                    <Route path="/admin/products" element={<ProductManagerPage />} />
                    <Route path="/search" element={
                        <PrivateRoute>
                            <SearchProductPage />
                        </PrivateRoute>
                    } />

                </Routes>
            </Content>
        </Layout>
    );
}
