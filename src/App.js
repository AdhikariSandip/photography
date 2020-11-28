import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Components/Home/Home';
import Blog from './Components/Blog/Blog';
import About from './Components/About/About';
import Login from './Components/Login/Login';
import Register from './Components/Login/Register';
import Pricing from './Components/Pricing/Pricing';
import Packages from './Components/Pricing/Packages';
import PriceList from './Components/Pricing/PriceList';
import Contact from './Components/Contact/Contact';
import Portfolio from './Components/Portfolio/Portfolio';
import Dashboard from './Components/AdminSection/Dashboard/dashboard';
import AdminAbout from './Components/AdminSection/Admin-About/Admin-about';
import AdminPortfolio from './Components/AdminSection/Admin-Portfolio/Admin-portfolio';
import AdminBlog from './Components/AdminSection/Admin-Blog/Admin-Blog';
import AdminContacts from './Components/AdminSection/Admin-Contacts/Admin-Contacts';
import AdminPricing from './Components/AdminSection/Admin-Pricing/Admin-Pricing';
import AdminPriceList from './Components/AdminSection/Admin-Pricing/Admin-PriceList';
import AdminPackages from './Components/AdminSection/Admin-Pricing/Admin-Packages';
import AdminOthers from './Components/AdminSection/Admin-Others/OthersSection';
import PortfolioGallery from './Components/Portfolio/PortfolioGallery';
import BlogGallery from './Components/Blog/BlogGallery';
import PrivateRoute from './Components/PrivateRoute';


function App() {
  return (
  <>
  <BrowserRouter>
  <Switch>
    <Route path='/' exact component={Home}/>
    <Route path='/blog'  component={Blog} />
    <Route path='/blogGallery'  component={BlogGallery} />
    <Route path='/about' component={About} />
    <Route path='/pricing' component={Pricing} />    
    <Route path='/contact' component={Contact} />
    <Route path='/portfolio' component={Portfolio} />
    <Route path='/portfolioGallery' component={PortfolioGallery} />
    <Route path='/packages' component={Packages} />
    <Route path='/price-list' component={PriceList} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />

    <PrivateRoute path="/dashboard" component={Dashboard} />
    <PrivateRoute path="/admin-about" component={AdminAbout} />
    <PrivateRoute path="/admin-portfolio" component={AdminPortfolio} />
    <PrivateRoute path="/admin-blog" component={AdminBlog} />
    <PrivateRoute path="/admin-contact" component={AdminContacts} />
    <PrivateRoute path="/admin-pricing" component={AdminPricing} />
    <PrivateRoute path="/admin-packages" component={AdminPackages} />
    <PrivateRoute path="/admin-priceList" component={AdminPriceList} />
    <PrivateRoute path="/admin-others" component={AdminOthers} />
  </Switch>
  </BrowserRouter>
  </>
  );
}

export default App;
