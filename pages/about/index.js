import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold tracking-wide text-blue-600 uppercase">About Us</h2>
          <p className="mt-2 text-3xl leading-9 font-extrabold text-gray-900 sm:text-4xl sm:leading-10">
            Modern Web Application for Accessibility Testing
          </p>
          <p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 mx-auto">
            Our web application offers an advanced solution to analyze and improve accessibility issues 
            across your website using a variety of online test tools. With real-time insights into accessibility
            compliance, we empower developers and organizations to create more inclusive digital experiences.
          </p>
        </div>
        <div className="mt-10 text-center">
          <p className="text-lg leading-7 text-gray-600">
            By leveraging cutting-edge testing tools, our platform simplifies the process of evaluating 
            websites for accessibility errors, warnings, and best practices, ensuring your web content 
            meets modern accessibility standards.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;