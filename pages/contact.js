import { useState } from 'react';
import { toast } from 'react-toastify';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    subject: '',
    text: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Your request is successful!'); 
        setFormData({
          name: '',
          email: '',
          number: '',
          subject: '',
          text: '',
        });
      } else {
        toast.error('Error! Unable to process your request.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error! Unable to process your request.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Contact Us</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-black dark:bg-gray-900 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-black dark:bg-gray-900 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="number" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="number"
            id="number"
            value={formData.number}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-black dark:bg-gray-900 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            id="subject"
            value={formData.subject}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-black dark:bg-gray-900 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="text" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
            Message
          </label>
          <textarea
            name="text"
            id="text"
            value={formData.text}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-black dark:bg-gray-900 dark:text-white"
            rows="5"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-300 text-black dark:bg-blue-500 dark:hover:bg-blue-300 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
