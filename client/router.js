import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import App from '../imports/ui/containers/App';

import Home from '../imports/ui/pages/Home';
import Register from '../imports/ui/pages/auth/Register';
import Logout from '../imports/ui/pages/auth/Logout';
import Login from '../imports/ui/pages/auth/Login';
import LoginRegister from '../imports/ui/pages/auth/LoginRegister';
import RequestPassword from '../imports/ui/pages/auth/RequestPassword';
import ResetPassword from '../imports/ui/pages/auth/ResetPassword';

import Profile from '../imports/ui/pages/user/ViewProfile';
import EditProfile from '../imports/ui/pages/user/EditProfile';
import ListUsers from '../imports/ui/pages/user/ListUsers';
import StatusFeed from '../imports/ui/pages/user/StatusFeed';


import AdminProducts from '../imports/ui/pages/admin/products/AdminProducts';
import CreateProduct from '../imports/ui/pages/admin/products/CreateProduct';
import EditProduct from '../imports/ui/pages/admin/products/EditProduct';

import AdminTags from '../imports/ui/pages/admin/tags/AdminTags';
import CreateTag from '../imports/ui/pages/admin/tags/CreateTag';
import EditTag from '../imports/ui/pages/admin/tags/EditTag';

import AdminCategories from '../imports/ui/pages/admin/categories/AdminCategories';
import CreateCategory from '../imports/ui/pages/admin/categories/CreateCategory';
import EditCategory from '../imports/ui/pages/admin/categories/EditCategory';

import AdminBrands from '../imports/ui/pages/admin/brands/AdminBrands';
import CreateBrand from '../imports/ui/pages/admin/brands/CreateBrand';
import EditBrand from '../imports/ui/pages/admin/brands/EditBrand';


import ListProducts from '../imports/ui/pages/products/ListProducts';
import ViewProduct from '../imports/ui/pages/products/ViewProduct';

import ListRoutines from '../imports/ui/pages/routines/ListRoutines';
import ViewRoutine from '../imports/ui/pages/routines/ViewRoutine';
import CreateRoutine from '../imports/ui/pages/routines/CreateRoutine';
import EditRoutine from '../imports/ui/pages/routines/EditRoutine';

import NotFound from '../imports/ui/pages/NotFound';

FlowRouter.route('/', {
  name: 'home',
  action() {
    mount(App, {
      content: <Home/>,
      className: 'website home',
    });
  },
});

/*
 *  Auth Pages
 */

FlowRouter.route('/register', {
  name: 'register',
  action() {
    mount(App, {
      content: <Register/>,
    });
  },
});

FlowRouter.route('/logout', {
  name: 'logout',
  action() {
    mount(App, {
      content: <Logout/>,
    });
  },
});

FlowRouter.route('/login', {
  name: 'login',
  action() {
    mount(App, {
      content: <Login/>,
    });
  },
});

FlowRouter.route('/loginRegister', {
  name: 'LoginRegister',
  action() {
    mount(App, {
      content: <LoginRegister/>,
    });
  },
});

FlowRouter.route('/requestPassword', {
  name: 'requestPassword',
  action() {
    mount(App, {
      content: <RequestPassword/>,
    });
  },
});

FlowRouter.route('/resetPassword/:token', {
  name: 'resetPassword',
  action() {
    mount(App, {
      content: <ResetPassword/>,
    });
  },
});

/*
 *  Product Pages
 */

FlowRouter.route('/products/', {
  name: 'listProducts',
  action() {
    mount(App, {
      content: <ListProducts/>,
    });
  },
});

FlowRouter.route('/products/:productId', {
  name: 'viewProduct',
  action() {
    mount(App, {
      content: <ViewProduct/>,
    });
  },
});


/*
 *  Routine Pages
 */

FlowRouter.route('/routines/', {
  name: 'listRoutines',
  action() {
    mount(App, {
      content: <ListRoutines/>,
    });
  },
});

FlowRouter.route('/routines/new', {
  name: 'createRoutine',
  action() {
    mount(App, {
      content: <CreateRoutine/>,
    });
  },
});

FlowRouter.route('/routines/:routineId', {
  name: 'viewRoutine',
  action() {
    mount(App, {
      content: <ViewRoutine/>,
    });
  },
});

FlowRouter.route('/routines/:routineId/edit', {
  name: 'editRoutine',
  action() {
    mount(App, {
      content: <EditRoutine/>,
    });
  },
});


/*
 *  Profile Pages
 */

FlowRouter.route('/status/:userId', {
  name: 'status',
  action() {
    mount(App, {
      content: <StatusFeed/>,
    });
  },
});

FlowRouter.route('/status', {
  name: 'myStatus',
  action() {
    mount(App, {
      content: <StatusFeed/>,
    });
  },
});

FlowRouter.route('/profile/:userId', {
  name: 'profile',
  action() {
    mount(App, {
      content: <Profile/>,
    });
  },
});

FlowRouter.route('/profile/:userId/edit', {
  name: 'editProfile',
  action() {
    mount(App, {
      content: <EditProfile/>,
    });
  },
});

FlowRouter.route('/profile', {
  name: 'myProfile',
  action() {
    mount(App, {
      content: <Profile/>,
    });
  },
});

FlowRouter.route('/users', {
  name: 'ListUsers',
  action() {
    mount(App, {
      content: <ListUsers/>,
    });
  },
});

/*
 *  Admin Pages
 */

FlowRouter.route('/admin/products', {
  name: 'AdminProducts',
  action() {
    mount(App, {
      content: <AdminProducts/>,
      className: 'admin',
    });
  },
});

FlowRouter.route('/admin/products/new', {
  name: 'adminProductsNew',
  action() {
    mount(App, {
      content: <CreateProduct/>,
      className: 'admin',
    });
  },
});

FlowRouter.route('/admin/products/:productId', {
  name: 'AdminProductsEdit',
  action() {
    mount(App, {
      content: <EditProduct/>,
      className: 'admin',
    });
  },
});

FlowRouter.route('/admin/tags', {
  name: 'AdminTags',
  action() {
    mount(App, {
      content: <AdminTags/>,
      className: 'admin',
    });
  },
});

FlowRouter.route('/admin/tags/new', {
  name: 'adminTagNew',
  action() {
    mount(App, {
      content: <CreateTag/>,
      className: 'admin',
    });
  },
});

FlowRouter.route('/admin/tags/:tagId', {
  name: 'AdminTagEdit',
  action() {
    mount(App, {
      content: <EditTag/>,
      className: 'admin',
    });
  },
});

FlowRouter.route('/admin/categories', {
  name: 'AdminCategories',
  action() {
    mount(App, {
      content: <AdminCategories/>,
      className: 'admin',
    });
  },
});

FlowRouter.route('/admin/categories/new', {
  name: 'adminCategoryNew',
  action() {
    mount(App, {
      content: <CreateCategory/>,
      className: 'admin',
    });
  },
});

FlowRouter.route('/admin/categories/:categoryId', {
  name: 'AdminCategoryEdit',
  action() {
    mount(App, {
      content: <EditCategory/>,
      className: 'admin',
    });
  },
});

FlowRouter.route('/admin/brands', {
  name: 'AdminBrands',
  action() {
    mount(App, {
      content: <AdminBrands/>,
      className: 'admin',
    });
  },
});

FlowRouter.route('/admin/brands/new', {
  name: 'adminBrandNew',
  action() {
    mount(App, {
      content: <CreateBrand/>,
      className: 'admin',
    });
  },
});

FlowRouter.route('/admin/brands/:brandId', {
  name: 'AdminBrandEdit',
  action() {
    mount(App, {
      content: <EditBrand/>,
      className: 'admin',
    });
  },
});

/*
 *  404 Page
 */

 FlowRouter.notFound = {
   name: 'notFound',
   action: function() {
     mount(App, {
       content: <NotFound/>,
     });
   }
 };
