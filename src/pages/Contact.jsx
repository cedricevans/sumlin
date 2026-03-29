import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
const Contact = () => {
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = e => {
    e.preventDefault();
    toast({
      title: "🚧 This feature isn't implemented yet but don't worry! You can request it in your next prompt! 🚀"
    });
  };
  const contactInfo = [{
    icon: Mail,
    title: 'Email',
    content: 'hello@midcenturydecor.com',
    link: 'mailto:hello@midcenturydecor.com'
  }, {
    icon: Phone,
    title: 'Phone',
    content: '(+49) 30 555 0123',
    link: 'tel:+49305550123'
  }, {
    icon: MapPin,
    title: 'Location',
    content: 'Berlin, Germany',
    link: '#'
  }];
  return <>
      <Helmet>
        <title>Contact Us - Midcentury Decor</title>
        <meta name="description" content="Get in touch with Midcentury Decor. We're here to help you find the perfect vintage furniture and home decor pieces." />
      </Helmet>

      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }} className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-gray-900 mb-6">Get in touch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about our collection? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => <motion.a key={info.title} href={info.link} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: index * 0.1
          }} className="flex flex-col items-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 text-white mb-4">
                  <info.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600 text-center">{info.content}</p>
              </motion.a>)}
          </div>

          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="col-span-1 lg:col-span-2">
            <img className="w-full h-[600px] object-cover rounded-2xl" alt="A patterned armchair in a well-lit room" src="https://horizons-cdn.hostinger.com/6ddbc4c1-b479-4ef4-be4a-ff36b8b1842e/polina-kuzovkova-abevonowqtg-unsplash-2QDVr.jpg" />
          </motion.div>
        </div>
      </div>
    </>;
};
export default Contact;