"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@civic/auth-web3/react";
import { userHasWallet } from "@civic/auth-web3";
import {
  LucideCompass,
  LucideMapPin,
  LucideSparkles,
  LucideLoader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LoginContent() {
  const navigate = useNavigate();

  const user = useUser();
  const [authState, setAuthState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [loading, setLoading] = useState(false);

  const handleCivicAuth = useCallback(async () => {
    try {
      // First complete the sign-in process without showing loader
      await user.signIn();

      // After sign-in is complete, show the loader for 2 seconds
      setAuthState("loading");

      // Set a fixed 2 second timeout before redirecting
      setTimeout(() => {
        navigate("/explore");
      }, 2000);
    } catch (error) {
      setAuthState("error");
      console.error("Authentication error:", error);
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user.authStatus === "authenticated") {
      navigate("/explore");
    }
  }, [user.authStatus, navigate]);

  useEffect(() => {
    const handleUserAuthentication = async () => {
      if (user.user) {
        console.log("User authenticated:", user);

        // First set success state
        setAuthState("success");

        // Then show loading animation for exactly 2 seconds regardless of wallet status
        setTimeout(async () => {
          setAuthState("loading");

          if (!userHasWallet(user)) {
            try {
              console.log("Creating wallet...");
              await user.createWallet();
              console.log("Wallet created successfully");
            } catch (error: unknown) {
              console.error("Error creating wallet:", error);
              // Even if there's an error, we'll continue with the loading animation
            }
          } else {
            console.log("User already has wallet");
          }

          // Always redirect after 2 seconds of showing the loader
          setTimeout(() => {
            navigate("/explore");
          }, 2000);
        }, 500); // Small delay before showing loader
      }
    };

    handleUserAuthentication();
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0.3 + Math.random() * 0.4,
              scale: 0.5 + Math.random() * 1.5,
            }}
            animate={{
              y: [null, Math.random() * -200, null],
              x: [null, Math.random() * 200, null],
              rotate: [0, Math.random() * 360],
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            {i % 3 === 0 ? (
              <LucideCompass
                className="text-indigo-300"
                size={20 + Math.random() * 30}
              />
            ) : i % 3 === 1 ? (
              <LucideMapPin
                className="text-pink-300"
                size={20 + Math.random() * 30}
              />
            ) : (
              <LucideSparkles
                className="text-amber-300"
                size={20 + Math.random() * 30}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`orb-${i}`}
            className="absolute rounded-full blur-3xl opacity-30"
            style={{
              background:
                i % 2 === 0
                  ? "linear-gradient(to right, #8b5cf6, #ec4899)"
                  : "linear-gradient(to right, #ec4899, #f59e0b)",
              width: 300 + Math.random() * 300,
              height: 300 + Math.random() * 300,
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: [null, Math.random() * window.innerWidth, null],
              y: [null, Math.random() * window.innerHeight, null],
            }}
            transition={{
              duration: 30 + Math.random() * 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Logo and title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12 text-center z-10"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex items-center justify-center mb-4"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-lg opacity-70"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.9, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <div className="relative bg-white rounded-full p-4 shadow-xl">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <LucideCompass className="h-12 w-12 text-purple-500" />
              </motion.div>
            </div>
          </div>
        </motion.div>
        <motion.h1
          className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Astralis
        </motion.h1>
        <motion.p
          className="mt-3 text-gray-600 max-w-md text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <motion.span
            className="inline-block"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0,
            }}
          >
            Discover
          </motion.span>{" "}
          <motion.span
            className="inline-block"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.3,
            }}
          >
            •
          </motion.span>{" "}
          <motion.span
            className="inline-block"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.6,
            }}
          >
            Collect
          </motion.span>{" "}
          <motion.span
            className="inline-block"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.9,
            }}
          >
            •
          </motion.span>{" "}
          <motion.span
            className="inline-block"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 1.2,
            }}
          >
            Earn
          </motion.span>
        </motion.p>
      </motion.div>

      {/* Login card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 rounded-2xl blur-lg opacity-70"
          animate={{
            background: [
              "linear-gradient(to right, #8b5cf6, #ec4899, #f59e0b)",
              "linear-gradient(to right, #f59e0b, #8b5cf6, #ec4899)",
              "linear-gradient(to right, #ec4899, #f59e0b, #8b5cf6)",
              "linear-gradient(to right, #8b5cf6, #ec4899, #f59e0b)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="relative bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl w-[350px] md:w-[400px]"
          whileHover={{
            y: -5,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <div className="text-center mb-8">
            <motion.h2
              className="text-2xl font-semibold text-gray-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              Get Started
            </motion.h2>
            <motion.p
              className="text-gray-600 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              Begin your NFT adventure
            </motion.p>
          </div>

          <motion.button
            onClick={handleCivicAuth}
            disabled={authState === "loading"}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium shadow-lg flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-80"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            <motion.span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.span
              className="absolute inset-0 bg-gradient-to-tr from-purple-400/20 to-transparent opacity-0 group-hover:opacity-100"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="relative">Get Authenticated with Civic</span>
            {authState !== "loading" && (
              <LucideSparkles className="relative h-5 w-5" />
            )}
            {authState === "loading" && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <LucideLoader2 className="h-5 w-5" />
              </motion.div>
            )}
          </motion.button>

          <div className="mt-6 text-center">
            <motion.p
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7, duration: 0.5 }}
            >
              Secure, seamless authentication powered by Civic
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.8 }}
        className="mt-12 text-center text-gray-500 text-sm z-10"
      >
        <p>Collect NFTs. Explore the world. Earn rewards.</p>
      </motion.div>

      {/* Loading overlay */}
      <AnimatePresence>
        {authState === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/50 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <div className="relative mb-4">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 blur-xl opacity-70"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 0.9, 0.7],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="relative h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-xl"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <motion.div
                    animate={{
                      rotate: -360,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: {
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      },
                      scale: {
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <LucideCompass className="h-10 w-10 text-purple-500" />
                  </motion.div>
                </motion.div>
              </div>
              <motion.h3
                className="text-xl font-medium text-gray-800"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                Authenticating with Civic...
              </motion.h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success animation */}
      <AnimatePresence>
        {authState === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/50 backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.2, 1],
                  opacity: 1,
                }}
                transition={{
                  duration: 0.5,
                  times: [0, 0.7, 1],
                }}
                className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center mb-4"
              >
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-medium text-gray-800"
              >
                Authentication Successful!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 mt-2"
              >
                Redirecting to explore...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
