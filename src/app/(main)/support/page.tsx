'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import SpeechToText from '@/components/client/SpeechToText'

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
})

export default function ContactPage() {
  const [speechContent, setSpeechContent] = React.useState('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (form.formState.isValid) {
      console.log(values)
    }
    
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-[#003366] mb-12">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Subject of your message" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <div className="flex flex-col space-y-2">
                            <Textarea 
                              placeholder="Your message" 
                              {...field} 
                              value={field.value || speechContent}
                              onChange={(e) => {
                                field.onChange(e);
                                setSpeechContent(e.target.value);
                              }}
                            />
                            <div className="flex justify-end">
                              <SpeechToText setContent={setSpeechContent} />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-[#003366] hover:bg-[#0257AC]">Send Message</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <MapPin className="text-[#003366]" />
                <p>123 AI Learning Street, Tech City, TC 12345</p>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="text-[#003366]" />
                <p>+1 (123) 456-7890</p>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="text-[#003366]" />
                <p>support@sparkmind.com</p>
              </div>
              <div className="flex items-center space-x-4">
                <Clock className="text-[#003366]" />
                <p>Monday - Friday: 9am - 5pm EST</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                <li>How do I reset my password?</li>
                <li>Can I upgrade my plan later?</li>
                <li>Do you offer student discounts?</li>
                <li>How can I request a new feature?</li>
              </ul>
              <Button className="mt-4 bg-[#003366] hover:bg-[#0257AC]" onClick={() => window.location.href = '/faq'}>
                View All FAQs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connect With Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Follow us on social media for the latest updates and learning tips:</p>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => window.open('/', '_self')}>Twitter</Button>
                <Button variant="outline" onClick={() => window.open('/', '_self')}>Facebook</Button>
                <Button variant="outline" onClick={() => window.open('/', '_self')}>LinkedIn</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}