'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useLogOutMutation } from '@/lib/api/authApi';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowDown from '../../images/arrow_down.png';
import { logout } from '@/store/authSlice';
import { setCredentials } from '@/store/authSlice';

export default function Navbar() {
  const { userInfo } = useSelector((state) => state.auth);
  const {cartItems} = useSelector((state) => state.cart);
  const [logOut] = useLogOutMutation();
  console.log("userInfo from navbar state", userInfo)
  console.log("cartItemscart", cartItems)
  const cartCount = cartItems.reduce((prev,cur) => prev + cur.quantity,0);
  const cartTotal = cartItems.reduce((prev,cur) => prev + (cur.quantity * cur.price),0);
  console.log("cartCount",cartCount)
  console.log("cartTotal",cartTotal)

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);  // State to check if it's client side
  const dispatch = useDispatch()


  const handleLogout = async () => {
    try {
      dispatch(logout())
      const logOutHandler = await logOut();
      console.log("logOutHandler", logOutHandler)
      //window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    setIsClient(true);  // Ensures the component renders only on the client side
  }, []);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.25,
        ease: 'easeOut',
        when: 'beforeChildren',
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        dispatch(setCredentials(JSON.parse(userInfo)));
      }
    }
  }, [dispatch]);

  if (!isClient) {
    return null; // Prevent rendering before the component has been hydrated
  }

  return (
    <header className='border-b border-gray-500 py-4'>
      <div className='container max-w-sitemax px-4 mx-auto'>
        <div className='header_wrapper flex justify-between items-center text-siteBlack relative'>
          <a href='/'>
            <Image
              src='/images/logo_lotus.png'
              alt='Logo image'
              width={80}
              height={90}
            />
          </a>

          {/* Mobile Toggle */}
          {isMobile && (
            <div
              className='cursor-pointer z-30 hidden'
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Image
                src='/icons/menu.svg' // Update this to your menu icon
                alt='menu'
                width={30}
                height={30}
              />
            </div>
          )}

          <nav
            className={`text-xl font-medium main_menu list-none hidden lg:flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-4 transition-all duration-300 bg-white md:bg-transparent absolute md:static top-full md:top-auto left-0 w-full md:w-auto p-6 md:p-0 shadow-md md:shadow-none z-20`}
          >
            <li>
              <Link href='/'>Home</Link>
            </li>

            <li
              className='cursor-pointer list-none relative flex gap-[2px] items-center has_children'
              onMouseEnter={() => !isMobile && setIsOpen(true)}
              onMouseLeave={() => !isMobile && setIsOpen(false)}
            >
              <span className='flex gap-[6px] items-center'>
                Shop
                <Image className='relative top-[3px]' src={ArrowDown} width={12} height={16} alt='arrow down' />
              </span>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className='submenu_wrap absolute left-0 pt-4 z-20 top-full'
                    variants={menuVariants}
                    initial='hidden'
                    animate='visible'
                    exit='exit'
                  >
                    <ul className='sub_menu bg-siteBlack text-white min-w-[200px] px-4 py-2 rounded shadow-lg'>
                      <li className='w-full'>
                        <Link className='py-2 border-b border-gray-400 block w-full' href='#'>Product 1</Link>
                      </li>
                      <li className='w-full'>
                        <Link className='py-2 border-b border-gray-400 block w-full' href='#'>Product 2</Link>
                      </li>
                      <li className='w-full'>
                        <Link className='py-2 border-b border-gray-400 block w-full' href='#'>Product 3</Link>
                      </li>
                      <li className='w-full'>
                        <Link className='py-2 border-b border-gray-400 block w-full' href='#'>Product 4</Link>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>


            <li>
              <Link href='/about'>About</Link>
            </li>
            <li>
              <Link href='/contact'>Contact</Link>
            </li>

            {userInfo ? (
              <>
                <li>
                  <Link href='/dashboard'>Dashboard</Link>
                </li>
                <li>
                  <button className='cursor-pointer' onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href='/login'>Login</Link>
                </li>
              </>
            )}

          </nav>

          { ( userInfo?.role !== 'admin') &&  <Link href="/cart">
            <div className='header_right cart_wrap flex items-center gap-2 cursor-pointer z-10'>
              <p className='cart_amount font-bold text-xl'>
                $<span>{cartTotal}</span>
              </p>
              <div className='cart_icon_wrap relative'>
                <Image
                  className='mb-[7px]'
                  src='/images/Cart.svg'
                  alt='Cart Image'
                  width={32}
                  height={32}
                />
                <p className='quantity absolute text-sm -top-6 -right-3 font-semibold bg-siteBlack rounded-full p-1 text-white w-8 h-8 flex items-center justify-center'>
                  {cartCount}
                </p>
              </div>
            </div>
          </Link>}
          
        </div>
      </div>
    </header>
  );
}
