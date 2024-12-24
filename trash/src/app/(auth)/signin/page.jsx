/* eslint-disable no-unused-vars */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Form, { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form";
import Input from "../../../components/ui/input";
import * as z from "zod";
import React from "react";
import axios from "axios";
import { useState } from "react";

const Page = () => {
  const form = useForm({
    resolver: zodResolver({ username: z.string(), password: z.string() }),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signin", {
        username,
        password,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      console.log("data", data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
    control={form.control}
    name="username"
    render={(field) => (
      <FormItem>
        <FormLabel />
        <FormControl>
        <Input placeholder="username" {...field}
        onChange={ (e) =>{
            field.onChange(e);
            setUsername(e.target.value);
        }} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    control={form.control}
    name="password"
    render={(field) => (
      <FormItem>
        <FormLabel />
        <FormControl>
        <Input placeholder="password"  {...field}
        onChange={ (e) =>{
            field.onChange(e);
            setUsername(e.target.value);
        }} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
        </form>

      </Form>
    </div>
  );
};

export default Page;
