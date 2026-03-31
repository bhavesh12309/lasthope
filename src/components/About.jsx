import React from 'react';
import { Users, Target, Award, Heart, Code, Zap } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'Lead Developer',
      description: 'Passionate about creating intuitive learning experiences',
      icon: <Code className="w-8 h-8 text-blue-500" />,
    },
    {
      name: 'Sarah Chen',
      role: 'UX Designer',
      description: 'Focused on making typing practice engaging and fun',
      icon: <Target className="w-8 h-8 text-purple-500" />,
    },
    {
      name: 'Mike Rodriguez',
      role: 'Education Specialist',
      description: 'Expert in typing pedagogy and skill development',
      icon: <Award className="w-8 h-8 text-green-500" />,
    },
  ];

  const features = [
    {
      title: 'Adaptive Learning',
      description: 'Our AI-powered system adapts to your skill level and learning pace',
      icon: <Zap className="w-12 h-12 text-yellow-500" />,
    },
    {
      title: 'Comprehensive Tracking',
      description: 'Detailed analytics help you understand your progress and areas for improvement',
      icon: <Target className="w-12 h-12 text-blue-500" />,
    },
    {
      title: 'Gamified Experience',
      description: 'Achievements, levels, and themes make learning typing enjoyable',
      icon: <Award className="w-12 h-12 text-purple-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">About</span>
            <br />
            <span className="text-gray-800 dark:text-white">TypeMaster</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            We're on a mission to help people around the world improve their typing skills 
            through innovative, engaging, and effective learning experiences.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  In today's digital world, typing is a fundamental skill that affects productivity, 
                  communication, and career opportunities. We believe everyone deserves access to 
                  high-quality typing education that's both effective and enjoyable.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  TypeMaster combines proven learning methodologies with modern technology to create 
                  a typing practice platform that adapts to each user's needs and keeps them motivated 
                  throughout their learning journey.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                  <Heart className="w-24 h-24 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {member.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-500 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 mb-2">1M+</div>
              <div className="text-gray-600 dark:text-gray-300">Words Typed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-300">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;