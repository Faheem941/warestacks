'use client';

// import { useApolloClient, useMutation } from '@apollo/client';
import Link from 'next/link';
import { useState } from 'react';
// import { logoutMutation } from '@/apollo/schema/authentication';
// import { selfQuery } from '@/apollo/schema/user';
// import useApolloErrorHandler from '@/apollo/utilities/utilities';
// import AppContext from '@/context/context';
import Image from 'next/image';
import Button from './button';
import ContactModal from './contactModal';

interface NavbarProps {
  isFixed?: boolean;
}

function Navbar({ isFixed = true }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const errorHandler = useApolloErrorHandler();
  // const apolloClient = useApolloClient();
  // const { self, isSelfLoading } = useContext(AppContext);

  // const [logout, { loading: isLogoutLoading }] = useMutation<{ logout: boolean }, {}>(
  //   logoutMutation,
  //   {
  //     onError: errorHandler,
  //     onCompleted() {
  //       apolloClient.stop();
  //       apolloClient.clearStore();

  //       localStorage.clear();

  //       window.location.href = '/auth';
  //     },
  //   },
  // );

  // const handleLogout = () => {
  //   if (apolloClient) {
  //     apolloClient.writeQuery({ query: selfQuery, data: { self: null } });
  //   }

  //   logout();
  // };

  // const isLoggedIn = self && !isSelfLoading;

  return (
    <>
      <header className={`${isFixed ? 'sticky' : 'relative'} top-0 z-50 bg-white shadow-md w-full`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-fit py-2">
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-bold text-primary">
              <Image
                width={1000}
                height={1000}
                src="/logo.png"
                alt="logo"
                className="w-full h-10"
              />
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 mx-auto">
            <Link href="/#features" passHref className="flex flex-col group">
              <p className="text-gray-600 hover:text-green-700 transition-all duration-300">
                Features
              </p>
              <div className="h-[0.1rem] bg-green-700 group-hover:w-full w-0 transition-all duration-300" />
            </Link>
            <Link href="/#pricing" passHref className="flex flex-col group">
              <p className="text-gray-600 hover:text-green-700 transition-all duration-300">
                Pricing
              </p>
              <div className="h-[0.1rem] bg-green-700 group-hover:w-full w-0 transition-all duration-300" />
            </Link>
            <Link href="/#key-benefit" passHref className="flex flex-col group">
              <p className="text-gray-600 hover:text-green-700 transition-all duration-300">
                Key Benefit
              </p>
              <div className="h-[0.1rem] bg-green-700 group-hover:w-full w-0 transition-all duration-300" />
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button
              text="Contact"
              type="outlined"
              onClick={() => {
                setIsModalOpen(!isModalOpen);
              }}
            />
            {/* <Button
            text={isLoggedIn ? 'Logout' : 'Login'}
            isLoading={isLogoutLoading || isSelfLoading}
            onClick={() => {
              if (isLoggedIn) {
                handleLogout();
                return;
              }

              window.location.href = '/auth';
            }}
          /> */}
          </div>
          <div className="md:hidden flex items-center justify-center text-gray-600 hover:text-green-700 transition-all duration-300">
            <button type="button" onClick={() => setMenuOpen(!menuOpen)}>
              {!menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white shadow-sm absolute w-full">
            <nav className="px-4 pt-4 pb-2 space-y-4">
              <Link href="/#features" passHref>
                <p className="block text-gray-600 hover:text-green-700 transition-all duration-300">
                  Features
                </p>
              </Link>
              <Link href="/#pricing" passHref>
                <p className="block text-gray-600 hover:text-green-700 transition-all duration-300">
                  Pricing
                </p>
              </Link>
              <Link href="/#key-benefit" passHref>
                <p className="block text-gray-600 hover:text-green-700 transition-all duration-300">
                  Key Benefit
                </p>
              </Link>
              <div className="mt-4">
                <Button
                  text="Contact"
                  type="outlined"
                  onClick={() => {
                    setIsModalOpen(!isModalOpen);
                  }}
                />
              </div>
            </nav>
          </div>
        )}
      </header>
      <ContactModal open={isModalOpen} setOpen={setIsModalOpen} />
    </>
  );
}

export default Navbar;
