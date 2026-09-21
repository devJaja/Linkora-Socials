'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, Coins, Shield, MessageCircle, Wallet, Gift, 
  Gamepad2, UtensilsCrossed, TrendingUp, Users, 
  ArrowRight, Sparkles, Check, Cpu, Globe, Lock,
  Zap as ZapIcon, Activity, AlertCircle, CheckCircle2,
  ArrowDownUp, Utensils, Dice1, Coins as CoinsIcon, 
  RotateCcw, Package, BarChart3, MessageSquare
} from 'lucide-react'
import WaitlistForm from '@/components/WaitlistForm'
import Logo from '@/components/Logo'
import DownloadSuggestion from '@/components/DownloadSuggestion'

const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL || 'https://linkora.app'

const features = [
  {
    icon: Coins,
    title: 'Tokenized Posts',
    description: 'Every post you create becomes a tradeable token on the Stellar blockchain. Your content has intrinsic value that grows as your influence expands.',
    details: 'Create, trade, and invest in creator tokens. Your posts are stored on-chain, making them truly yours forever.',
    color: 'from-[#002E5F] to-[#00A8B5]'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built on Stellar - the fastest blockchain with sub-second transactions and near-zero fees. Experience Web3 without the friction.',
    details: '100,000+ TPS throughput. Transactions settle in under 400ms. No waiting, no gas wars.',
    color: 'from-[#FDDB24] to-[#D4A800]'
  },
  {
    icon: Shield,
    title: 'True Ownership',
    description: 'Your data, your wallet, your rules. No platform can ban you, censor you, or take your earnings. Decentralization done right.',
    details: 'Self-custody wallet. On-chain content. Censorship-resistant. You are the sole owner of your digital identity.',
    color: 'from-[#00A8B5] to-[#002E5F]'
  },
  {
    icon: MessageCircle,
    title: 'SocialFi Ecosystem',
    description: 'The first social platform that combines social networking with DeFi. Follow, engage, and earn - all in one place.',
    details: 'Follow creators, send tips, join communities, and earn rewards for your participation in the ecosystem.',
    color: 'from-[#B7ACE8] to-[#00A8B5]'
  },
  {
    icon: TrendingUp,
    title: 'Creator Economy',
    description: 'Trade creator tokens like stocks. Early supporters earn as creators grow. Everyone wins in the creator economy.',
    details: 'Buy tokens when creators are undervalued. Earn from their growth. Participate in governance decisions.',
    color: 'from-[#002E5F] to-[#B7ACE8]'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Build your network with genuine connections. No algorithms hiding your content. What you post is what you get.',
    details: 'Organic reach. Real engagement. No pay-to-play. Your content reaches your audience, not a corporate agenda.',
    color: 'from-[#FDDB24] to-[#00A8B5]'
  }
]

const miniApps = [
  { icon: ArrowDownUp, name: 'Token Swap', desc: 'Swap XLM for any token instantly with real-time rates from DexScreener' },
  { icon: Utensils, name: 'Food Delivery', desc: 'Order food from local restaurants and pay with XLM instantly' },
  { icon: Dice1, name: 'Dice Game', desc: 'Roll the dice and win XLM rewards. 50% win rate with instant payouts' },
  { icon: CoinsIcon, name: 'Coin Flip', desc: 'Double your bet instantly. Heads or tails - the choice is yours' },
  { icon: RotateCcw, name: 'Lucky Spin', desc: 'Spin the wheel for multipliers up to 5x. Win XLM rewards' },
  { icon: Package, name: 'Daily Airdrop', desc: 'Claim free XLM every 24 hours. No strings attached' },
  { icon: BarChart3, name: 'Portfolio Tracker', desc: 'Track your token holdings, earnings, and portfolio value in real-time' },
  { icon: MessageSquare, name: 'Crypto Chat', desc: 'End-to-end encrypted messaging with built-in crypto tipping' }
]

const stats = [
  { value: '$0', label: 'Platform Fees', icon: Wallet },
  { value: '<1s', label: 'Transaction Speed', icon: ZapIcon },
  { value: '100%', label: 'You Own Your Data', icon: Lock },
  { value: '24/7', label: 'Always Available', icon: Globe },
  { value: '100k+', label: 'TPS Capacity', icon: Cpu },
  { value: '0', label: 'Censorship Risk', icon: Shield }
]

export default function Home() {
  const [email, setEmail] = useState('')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#001A33] text-white overflow-x-hidden">
      {/* Top Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 bg-[#001A33]/80 backdrop-blur-sm border-b border-white/5">
        <a href="#" className="flex items-center gap-3">
          <Logo size={40} />
          <span className="font-bold text-lg hidden xs:block">Linkora</span>
        </a>
        <div className="flex items-center gap-3 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <a href="#features" className="hover:text-[#FDDB24] transition">Features</a>
            <a href="#mini-apps" className="hover:text-[#FDDB24] transition">Mini Apps</a>
          </nav>
          <a
            href={WEB_URL}
            target="_blank"
            rel="noreferrer"
            className="bg-gradient-to-r from-[#FDDB24] to-[#D4A800] hover:from-[#FFC800] hover:to-[#FDDB24] text-[#002E5F] font-bold rounded-xl px-5 py-2.5 text-sm shadow-lg shadow-[#FDDB24]/25 hover:shadow-[#FDDB24]/40 transition"
          >
            Get Started
          </a>
        </div>
      </header>
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated glowy circles */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 90, 180, 270, 360],
            x: [0, 100, 0, -100, 0],
            y: [0, 50, 100, 50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#FDDB24]/15 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#00A8B5]/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 60, 120, 180, 240, 300, 360],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#B7ACE8]/10 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 right-1/3 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -120, -240, -360],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/3 left-1/3 w-[450px] h-[450px] bg-[#002E5F]/20 rounded-full blur-[90px]"
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_100%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20 pt-32">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              duration: 1
            }}
            className="mb-12"
          >
            <Logo size={120} />
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tight"
          >
            Social Media That<br/>
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="inline-block bg-gradient-to-r from-[#FDDB24] via-[#FFE066] to-[#FDDB24] bg-[length:200%_auto] bg-clip-text text-transparent"
            >
              Pays You
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Own your content. Own your earnings. Every post becomes a tradeable token on Stellar blockchain.
            <br className="hidden md:block" />
            The first <span className="text-[#B7ACE8] font-semibold">SocialFi</span> platform redefining social media.
          </motion.p>

          {/* Get Started (opens the web app) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-10 flex flex-col items-center gap-3"
          >
            <a
              href={WEB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FDDB24] to-[#D4A800] hover:from-[#FFC800] hover:to-[#FDDB24] text-[#002E5F] font-bold rounded-2xl px-10 py-5 text-xl shadow-2xl shadow-[#FDDB24]/30 hover:shadow-[#FDDB24]/50 transition group"
            >
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              Get Started
            </a>
            <span className="text-gray-500 text-sm">— or join the waitlist —</span>
          </motion.div>

          {/* Waitlist Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <WaitlistForm />
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 text-gray-400 mt-12"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
              <Sparkles className="w-5 h-5 text-[#FDDB24]" />
              <span>Built on Stellar</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
              <Shield className="w-5 h-5 text-green-400" />
              <span>Secure & Decentralized</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
              <Zap className="w-5 h-5 text-[#FDDB24]" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
              <Activity className="w-5 h-5 text-[#00A8B5]" />
              <span>Real-Time</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 px-4 border-y border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center group"
              >
                <div className="mb-4 flex justify-center">
                  <stat.icon className="w-8 h-8 text-[#FDDB24] group-hover:text-[#FFE066] transition-colors" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDDB24] to-[#B7ACE8]">Linkora</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The first social platform where creators truly own their success and earn directly from their community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#002E5F]/30`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-4 leading-relaxed">{feature.description}</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-[#B7ACE8] font-medium">{feature.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini Apps Section */}
      <section id="mini-apps" className="relative py-32 px-4 bg-gradient-to-b from-[#001A33] to-black/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              More Than Just <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A8B5] to-[#B7ACE8]">Social</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A complete ecosystem of mini-apps built right into the platform for entertainment, trading, and rewards.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {miniApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-white/10 hover:border-[#FDDB24]/50 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#002E5F] to-[#00A8B5] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <app.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{app.name}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{app.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDDB24] to-[#00A8B5]">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Three simple steps to start earning from your content on the blockchain.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-1 bg-gradient-to-r from-[#FDDB24] via-[#B7ACE8] to-[#00A8B5] rounded-full" />
            
            {[
              { step: '1', title: 'Create Content', desc: 'Post photos, videos, or thoughts just like any social platform. Your content is stored on-chain.', icon: Activity },
              { step: '2', title: 'Tokenize & Trade', desc: 'Your posts become tokens that followers can buy and trade. You earn as your content gains value.', icon: TrendingUp },
              { step: '3', title: 'Earn XLM', desc: 'Get paid directly in XLM as your content gains traction. No platform takes a cut of your earnings.', icon: Wallet }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center relative z-10"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-24 h-24 bg-gradient-to-br from-[#002E5F] to-[#00A8B5] rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#002E5F]/30"
                >
                  <span className="text-4xl font-bold text-white">{item.step}</span>
                </motion.div>
                <item.icon className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Features Showcase */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Everything You Need in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A8B5] to-[#FDDB24]">One App</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-6">
                {[
                  'Create and share posts, photos, videos',
                  'Like, comment, and engage with community',
                  'Follow creators and build your network',
                  'Buy and sell creator tokens',
                  'Send instant crypto payments',
                  'Play games and win rewards',
                  'Order food with crypto',
                  'Track your portfolio and earnings',
                  'Join communities and DAOs',
                  'Participate in governance',
                  'Earn from engagement and tips',
                  'Trade on decentralized exchanges'
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#002E5F] to-[#00A8B5] rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl shadow-[#00A8B5]/20 p-8 border border-white/10"
              >
                <div className="aspect-[9/16] bg-gradient-to-br from-[#002E5F]/50 to-[#00A8B5]/30 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Animated background elements */}
                  <motion.div
                    animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-br from-[#FDDB24]/15 to-[#00A8B5]/15 rounded-full blur-3xl" 
                  />
                  <div className="text-center relative z-10">
                    <Logo size={140} />
                    <p className="mt-6 text-gray-400 font-semibold text-lg">Mobile App Preview</p>
                    <p className="mt-2 text-sm text-gray-500">iOS & Android • Coming Soon</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -30, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -top-10 -right-10 bg-gradient-to-br from-[#002E5F] to-[#00A8B5] rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70">Earnings</p>
                    <p className="text-lg font-bold">+2.5 XLM</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-8 -left-8 bg-gradient-to-br from-[#00A8B5] to-[#002E5F] rounded-2xl p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-white/70">New Messages</p>
                    <p className="text-lg font-bold">12</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002E5F]/30 via-[#00A8B5]/20 to-[#B7ACE8]/20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-8">
              Ready to Own Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FDDB24] to-[#B7ACE8]">Social Future</span>?
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Join the waitlist and be among the first to experience social media that actually rewards creators.
              <br className="hidden md:block" />
              The future of SocialFi is here.
            </p>

            <a
              href={WEB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FDDB24] to-[#D4A800] hover:from-[#FFC800] hover:to-[#FDDB24] text-[#002E5F] font-bold rounded-2xl px-10 py-5 text-xl shadow-2xl shadow-[#FDDB24]/30 hover:shadow-[#FDDB24]/50 transition mb-10 group"
            >
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              Get Started
            </a>

            <WaitlistForm />

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex items-center justify-center gap-4 text-gray-400"
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm">We respect your privacy. No spam, ever.</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <Logo size={56} className="mb-6" />
              <p className="text-gray-400 text-sm leading-relaxed">
                Social media powered by Stellar blockchain. Own your content, own your earnings.
                <br className="hidden md:block" />
                Building the future of SocialFi.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Product</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-[#FDDB24] transition">Features</a></li>
                <li><a href="#mini-apps" className="hover:text-[#FDDB24] transition">Mini Apps</a></li>
                <li><a href="#" className="hover:text-[#FDDB24] transition">Tokenomics</a></li>
                <li><a href="#" className="hover:text-[#FDDB24] transition">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Resources</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#FDDB24] transition">Documentation</a></li>
                <li><a href="#" className="hover:text-[#FDDB24] transition">Blog</a></li>
                <li><a href="#" className="hover:text-[#FDDB24] transition">Support</a></li>
                <li><a href="#" className="hover:text-[#FDDB24] transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Connect</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#FDDB24] transition">Twitter</a></li>
                <li><a href="#" className="hover:text-[#FDDB24] transition">Discord</a></li>
                <li><a href="#" className="hover:text-[#FDDB24] transition">Telegram</a></li>
                <li><a href="mailto:team@linkora.social" className="hover:text-[#FDDB24] transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2024 Linkora. All rights reserved. Proprietary software.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition">Privacy Policy</a>
              <a href="#" className="hover:text-white transition">Terms of Service</a>
              <a href="#" className="hover:text-white transition">License</a>
            </div>
          </div>
        </div>
      </footer>

      <DownloadSuggestion />
    </main>
  )
}
