import React from "react";

const LoginForm = () => {
    return (
    <div className="relative font-medium md:h-screen flex items-center content-center">
    <div className="mr-auto ml-auto w-full">
      <div className="w-full max-w-md mr-auto ml-auto mt-4 mb-1 text-center">
        <h1 className="text-gray-800 block text-3xl font-extrabold font-title">Sign in</h1>
      </div>
      <div className="w-full max-w-md mr-auto ml-auto mt-4">
        <div className="bg-white shadow-lg rounded-md px-8 py-8 mb-4 ml-auto mr-auto">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" for="username"> Email
              address </label>
            <input className="shadow-sm appearance-none border border-gray-400 rounded w-full py-4 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:border-indigo-300" id="username" type="text" placeholder="user@example.com"></input>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" for="username"> Password </label>
            <input className="shadow-sm appearance-none border border-gray-400 rounded w-full py-4 px-3 text-gray-700 text-sm leading-tight focus:outline-none focus:border-indigo-300" id="password" type="password" placeholder="***************"></input>
          </div>
          <div className="mb-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="text-center sm:text-left">
                <label>
                  <input type="checkbox" className="mr-2"></input>
                  <span className="text-sm font-medium text-gray-700 ">Remember me</span>
                </label>
              </div>
              <div className="text-center sm:text-right">
                <a href="#" className="text-indigo-600 font-medium text-sm duration-200 transition-colors hover:text-indigo-800">Forgot
                  your password?</a>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <button type="button" className="bg-indigo-500 hover:bg-indigo-600 shadow-lg text-white font-semibold text-sm py-3 px-0 rounded text-center w-full hover:bg-tertiary duration-200 transition-all">
              Sign in
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-0 mb-6">
            <hr className="mt-3 hidden sm:block border-gray-400"></hr>
            <span className="text-center bg-white text-sm text-gray-700 font-normal">Or continue with</span>
            <hr className="mt-3 hidden sm:block border-gray-400"></hr>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" className="relative border-solid border shadow-sm border-gray-400
                          font-semibold text-gray-600 text-sm py-1 text-center rounded text-center w-full
                          focus:outline-none hover:border-indigo-600 transition-all duration-200">
              <i className="fab fa-google text-lg" style="line-height: 28px;"></i>
            </button>
            <button type="button" className="relative border-solid border shadow-sm border-gray-400
                          font-semibold text-gray-600 text-sm py-1 px-0 rounded text-center w-full
                          focus:outline-none hover:border-indigo-600 transition-all duration-200">
              <i className="fab fa-twitter text-lg" style="line-height: 28px;"></i>
            </button>
            <button type="button" className="relative border-solid border shadow-sm border-gray-400
                          font-semibold text-gray-600 text-sm py-1 px-0 rounded text-center w-full
                          focus:outline-none hover:border-indigo-600 transition-all duration-200">
              <i className="fab fa-linkedin text-lg" style="line-height: 28px;"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  );

};

export default LoginForm;