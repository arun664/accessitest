import React from "react";
import { FaCheckCircle, FaChartBar, FaCodeBranch, FaLightbulb } from "react-icons/fa";

const About = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full p-6 mx-auto">
        <h2 className="text-base font-semibold tracking-wide text-blue-600 dark:text-blue-400 uppercase">
          About Us
        </h2>
        <p className="mt-2 text-3xl leading-9 font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10">
          Modern Web Application for Accessibility Testing
        </p>
        <p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 dark:text-gray-300">
          Our web application offers an advanced solution to analyze and improve
          accessibility issues across your website using a variety of online
          test tools. With real-time insights into accessibility compliance, we
          empower developers and organizations to create more inclusive digital
          experiences.
        </p>

        <div className="mt-10">
          <p className="text-lg leading-7 text-gray-600 dark:text-gray-400">
            By leveraging cutting-edge testing tools, our platform simplifies
            the process of evaluating websites for accessibility errors,
            warnings, and best practices, ensuring your web content meets modern
            accessibility standards.
          </p>
        </div>

        {/* Features Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Key Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
              <FaCheckCircle className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Real-Time Accessibility Testing
              </h4>
              <div className="text-lg text-gray-600 dark:text-gray-400 mt-4 pl-4">
                Utilize tools like Axe-Core and Pa11y to perform instant accessibility checks across your website.
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
              <FaChartBar className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Detailed Reports & Insights
              </h4>
              <div className="text-lg text-gray-600 dark:text-gray-400 mt-4 pl-4">
                View accessibility violations with actionable recommendations to enhance the user experience.
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
              <FaCodeBranch className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Multi-Tool & Customizable Testing
              </h4>
              <div className="text-lg text-gray-600 dark:text-gray-400 mt-4 pl-4">
                Choose different testing parameters and tools to perform deep analysis tailored to your needs.
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
              <FaLightbulb className="text-blue-600 dark:text-blue-400 text-4xl mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                AI-Powered Suggestions & Fixes
              </h4>
              <div className="text-lg text-gray-600 dark:text-gray-400 mt-4 pl-4">
                Receive intelligent suggestions and automated code fixes powered by Mistral AI to improve accessibility.
              </div>
            </div>
          </div>
        </div>

        {/* Credits Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Credits
          </h3>
          <ul className="mt-4 text-lg leading-7 text-gray-600 dark:text-gray-400 list-disc pl-8">
            <li>
              <strong>
                <a
                  href="https://www.deque.com/axe/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400"
                >
                  Axe-Core
                </a>
                :
              </strong>{" "}
              A powerful accessibility testing library for identifying issues in web pages.
            </li>
            <li>
              <strong>
                <a
                  href="https://pa11y.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400"
                >
                  Pa11y
                </a>
                :
              </strong>{" "}
              A tool for automated web accessibility testing that highlights errors and suggests improvements.
            </li>
            <li>
              <strong>
                <a
                  href="https://www.w3.org/WAI/WCAG21/quickref/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400"
                >
                  WCAG (Web Content Accessibility Guidelines)
                </a>
                :
              </strong>{" "}
              Guidelines for ensuring web content is accessible to people with disabilities.
            </li>
            <li>
              <strong>
                <a
                  href="https://www.mistral.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400"
                >
                  Mistral AI
                </a>
                :
              </strong>{" "}
              Provides suggestions and code fixes to improve accessibility.
            </li>
          </ul>
        </div>

        {/* GitHub Repository Link */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            GitHub Repository
          </h3>
          <p className="mt-4 text-lg leading-7 text-gray-600 dark:text-gray-400">
            Explore our code and contribute to the project on GitHub:{" "}
            <a
              href="https://github.com/arun664/accessitest"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-semibold"
            >
              AccessiTest
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;