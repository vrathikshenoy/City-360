'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { MapPin, Phone, User, Send } from 'lucide-react';
const FeedbackForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+91');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
      });
    } else {
      setLocation("Geolocation not available");
    }
  }, []);

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    if (/^\+91\d{0,10}$/.test(input)) {
      setPhone(input);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length !== 13) {
      toast({
        title: "Invalid Phone Number",
        description: 'Phone number must be a 10-digit number starting with +91',
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    let imageBase64 = '';
    if (image) {
      imageBase64 = await convertToBase64(image);
    }

    const templateParams = {
      name,
      phone,
      location,
      description,
      image: imageBase64,
    };
   const publickey=process.env.NEXT_PUBLIC_EMAIL;
   const serviceid=process.env.NEXT_PUBLIC_SERVICE_ID;
   const templateid=process.env.NEXT_PUBLIC_TEMPLATE_ID;
    try {
      const response = await emailjs.send(
        serviceid,
        templateid,
        templateParams,
        publickey
      );

      toast({
        title: "Success",
        description: 'Feedback submitted successfully!',
      });
      
      setName('');
      setPhone('+91');
      setDescription('');
      setImage(null);
    } catch (error) {
      toast({
        title: "Error",
        description: 'Failed to submit feedback. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: "spring", stiffness: 300 } },
    blur: { scale: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-500 flex items-center justify-center mt-20 pt-4">
      <Card className="w-full max-w-lg mx-auto shadow-2xl rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <CardTitle className="text-3xl font-bold text-center">
            Share Your Feedback
          </CardTitle>
          <p className="text-center mt-2 text-blue-100">We value your opinion!</p>
        </CardHeader>

        <CardContent className="p-8">
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <motion.div variants={inputVariants} whileHover="focus" whileTap="focus" whileFocus="focus">
                <Input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  icon={<User className="text-gray-400" />}
                />
              </motion.div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Phone Number (+91)</label>
              <motion.div variants={inputVariants} whileHover="focus" whileTap="focus" whileFocus="focus">
                <Input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  icon={<Phone className="text-gray-400" />}
                />
              </motion.div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <motion.div variants={inputVariants} whileHover="focus" whileTap="focus">
                <Input
                  type="text"
                  value={location}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  icon={<MapPin className="text-gray-400" />}
                />
              </motion.div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Feedback</label>
              <motion.div variants={inputVariants} whileHover="focus" whileTap="focus" whileFocus="focus">
                <Textarea
                  placeholder="Your Feedback"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={5}
                />
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                type="submit"
                className="w-full py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition duration-300 flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <AnimatePresence>
                    <motion.div
                      key="spinner"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-6 h-6 border-t-2 border-b-2 border-white rounded-full animate-spin"
                    />
                  </AnimatePresence>
                ) : (
                  <>
                    <Send className="mr-2" size={20} />
                    Submit Feedback
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
};

export default FeedbackForm;