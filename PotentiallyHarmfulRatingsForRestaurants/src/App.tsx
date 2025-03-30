/**
 * Tommy Chang
 * CEN 3024 - Software Development 1
 * March 12, 2025
 * App.tsx
 * This application is built using react, shadcn, and deployed into github pages.
 * The purpose of this application is to provide a GUI for creating/reading/updating/deleting reviews for restaurants
*/

import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import './App.css'
import { Button } from './components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "./components/ui/input"
import { Textarea } from './components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Toaster } from './components/ui/sonner'
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog"
import { DialogFooter } from './components/ui/dialog'
import { Label } from './components/ui/label';



interface restaurant {
  id: number;
  name: string;
  phone: string;
  address: string;
  type: string;
  rating: number,
  ratingCount: number
}

interface CustomerReview {
  id: number;
  title: string;
  comment: string;
  rating: number;
  customerName: string;
  publishDate: string;
  lastUpdated: string;
  restaurantId: number;
}

const CustomerReviewFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title must not be empty."
  }),
  comment: z.string().min(1, {
    message: "Comment must not be empty."
  }).max(255, {
    message: "Comment must be less than 255 characters."
  }),
  rating: z.string().min(1,{
    message: "Please select a number between 1 - 5."
  }),
  customerName: z.string().min(1, {
    message: "Customer Name must not be empty."
  }),
  restaurantID: z.string().min(1, {
    message: "Restaurant Name must not be empty."
  })
})

const CustomerReviewEditFormSchema = z.object({
  id: z.number().min(0  , {
    message: "Id must not be empty."
  }),
  title: z.string()
  .max(45, {
    message: "Title must be less than 45 characters."
  })
  .min(1, {
    message: "Title must not be empty."
  }),
  comment: z.string().min(1, {
    message: "Comment must not be empty."
  }).max(255, {
    message: "Comment must be less than 255 characters."
  }),
  rating: z.string().min(1,{
    message: "Please select a number between 1 - 5."
  }),
  customerName: z.string().min(1, {
    message: "Customer Name must not be empty."
  }).max(45, {
    message: "Customer Name must be less than 45 characters."
  }),
  restaurantID: z.string().min(1, {
    message: "Restaurant Name must not be empty."
  })
})

/**
 * method: App
 * parameters: none
 * return: react component
 * purpose: returns the component of this Single Page Application
 */
function App() {

  /*
  * Hooks section
  */
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>([]);
  const [restaurants, setRestaurants] = useState<restaurant[]>([]);
  const [reviewToBeEdited, setReviewToBeEdited] = useState<CustomerReview>();
  const [restaurantSelect, setRestaurantSelect] = useState(0);
  const [reviewIds, setReviewIds] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const editForm = useForm<z.infer<typeof CustomerReviewEditFormSchema>>({
    resolver: zodResolver(CustomerReviewEditFormSchema),
    defaultValues: {
      id: -1,
      title: "",
      comment: "",
      rating: "",
      customerName: "",
      restaurantID: ""
    },
  })
  
  const form = useForm<z.infer<typeof CustomerReviewFormSchema>>({
    resolver: zodResolver(CustomerReviewFormSchema),
    defaultValues: {
      title: "",
      comment: "",
      rating: "",
      customerName: "",
      restaurantID: ""
    },
  })
  

  /*
  * Crud Function Section
  */
  
  /**
  * method: addReview
  * parameters: string, string, number, string, number
  * return: boolean
  * purpose: creates a review given review type parameters. Returns true/false on success
  */
  async function addReview(title:string, comment:string, rating:number, customerName:string, restaurantId:number){

    let review:CustomerReview = {
      id: 0,
      title: title,
      comment: comment,
      rating: rating,
      customerName: customerName,
      restaurantId: restaurantId,
      publishDate: "",
      lastUpdated: ""
    }
    return postReview(review).then((success) => {
      console.log(review);
      return success;
    }).catch((success:boolean) =>{
      return success;
    });
    
  }

  const postReview = async (reviewObj:CustomerReview) => {
    try{
      let url = 'http://localhost:3000/customerReview/createone'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewObj)
      })
      
      if (!response.ok) {
        console.log(response.status);
      }
      const customerReviewsTemp = await response.json();
      setCustomerReviews(customerReviewsTemp);
      return true;
    }
    catch(error){
      console.error(error);
      return false;
    }
  }

  /**
  * method: updateReview
  * parameters: number, string, number
  * return: boolean
  * purpose: updates a review given review type parameters. Returns true/false on success
  */
  async function updateReview(id:number, comment:string, rating:number){
    try{
      let url = 'http://localhost:3000/customerReview/updateone'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id:id, comment: comment, rating: rating})
      })
      
      if (!response.ok) {
        console.log(response.status);
      }
      const customerReviewsTemp = await response.json();
      setCustomerReviews(customerReviewsTemp);
      return true;
    }
    catch(error){
      console.error(error);
      return false;
    }
  }

  /**
  * method: processFileUpload
  * parameters: string
  * return: boolean
  * purpose: processes a review through an uploaded file.
  */
  function processFileUpload(filecontents:String){
    if (filecontents){
      let inputArr = filecontents.split("\r\n");
      var count = 1;
      var success = 0;
      var fail = 0;
      inputArr.forEach(review => {
        let reviewParts = review.split("-");
        //Title-Comment-Rating-CustomerName-RestaurantID
        try{
          if (Number(reviewParts[4]) >= 3 || Number(reviewParts[4]) < 0 || reviewParts[0].length === 0 || reviewParts[3].length === 0 || reviewParts[2].length === 0){
            throw Error()
          }
          addReview(reviewParts[0], reviewParts[1], Number(reviewParts[2]), reviewParts[3], Number(reviewParts[4])).then((add) => {
            if (add){
              success += 1;
            }
            else{
              toast.warning("Trouble uploading review line: " + count);
              fail += 1;
            }
          });
        }
        catch (error){
          toast.warning("Trouble uploading review line: " + count);
          fail += 1;
        }
        count++;
        
      });
      setTimeout(() => {toast.success("Uploaded " + success + " reviews, failed " + fail)}, 200); 
      
    }
    
  }

  /**
  * method: deleteReview
  * parameters: number, string, number
  * return: boolean
  * purpose: updates a review given review type parameters. Returns true/false on success
  */
  async function deleteReview(id:number){  
    try{
      let url = 'http://localhost:3000/customerReview/deleteone'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: id})
      })
      
      if (!response.ok) {
        console.log(response.status);
      }
      const customerReviewsTemp = await response.json();
      setCustomerReviews(customerReviewsTemp);
      return true;
    }
    catch(error){
      console.error(error);
      return false;
    }
  }

  /**
  * method: onSubmit
  * parameters: CustomerReviewFormSchema
  * return: none
  * purpose: handles button click for creating reviews
  */
  function onSubmit(values: z.infer<typeof CustomerReviewFormSchema>) {
    addReview(values.title, values.comment, Number(values.rating), values.customerName, Number(values.restaurantID));
    toast.success("Review has been created.")
  }

  /**
  * method: onSubmitUpdate
  * parameters: CustomerReviewEditFormSchema
  * return: none
  * purpose: handles button click for updating reviews
  */
  function onSubmitUpdate(values: z.infer<typeof CustomerReviewEditFormSchema>) {
    updateReview(values.id, values.comment, Number(values.rating));
    toast.success("Review ID " + values.id + " has been updated." )
  }

  /**
  * method: onSubmitDelete
  * parameters: CustomerReviewEditFormSchema
  * return: none
  * purpose: handles button click for deleting reviews
  */
  function onSubmitDelete(values: z.infer<typeof CustomerReviewEditFormSchema>) {
    deleteReview(values.id).then((value) => {
      if (value){
        toast.success("Review ID " + values.id + " has been deleted." );
      }
    });
    
  }

  /**
  * method: handleRestaurantClick
  * parameters: CustomerReviewFormSchema
  * return: none
  * purpose: provides function callback for changing state of restaurant selected
  */
  const handleRestaurantClick = (e: React.SyntheticEvent) => {
    setRestaurantSelect(Number(e.currentTarget.id));
  }

  /**
  * method: handleOnUpload
  * parameters: CustomerReviewFormSchema
  * return: none
  * purpose: provides function callback for validating input file is .txt and then processes the file using helper
  */
  const handleOnUpload = () => {
    if (fileInputRef.current?.files){
      const file = fileInputRef.current.files[0];
      if (file && file.type === "text/plain") { // Ensure it's a .txt file
        const reader = new FileReader();  

        reader.onload = (event) => {
          const fileContents = event?.target?.result;
          processFileUpload(String(fileContents));
        };
  
        reader.onerror = () => {
          toast.error("Error reading file:" + file.name);
        };
  
        reader.readAsText(file); // Read file as text
        
      } else {
        toast.error("Please select a valid .txt file.");
      }
    }
  }

  /**
  * method: getReviews
  * parameters: number
  * return: customerReviews[]
  * purpose: provides callback function for filtering customerReviews based on RestaurantSelect
  */
  const getReviews = (restaurantSelect:Number) => {
    return (customerReviews.filter(review => review.restaurantId === restaurantSelect));
  }

  /**
  * method: updateRestaurantRatings
  * parameters: number, number, number
  * return: restaurant
  * purpose: provides callback function for updating restaurant rating information
  */
  const updateRestaurantRatings = (restaurantId:number, rating:number, ratingCount:number) => {
    setRestaurants(restaurants.filter((restaurant) => {
      if (restaurant.id === restaurantId){
        restaurant.rating = rating;
        restaurant.ratingCount = ratingCount;
        return restaurant;
      }
      else{
        return restaurant;
      }
    })
    );
  }

  /**
  * method: getRestaurantGrade
  * parameters: number, number, number
  * return: string
  * purpose: custom action provides callback function for retrieving relevant restaurant grade
  */
  const getRestaurantGrade = (rating:number) => {
    if (rating === 5){
      return "A";
    }
    else if (rating >= 4){
        return "B";
    }
    else if (rating >= 3){
        return "C";
    }
    else if (rating >= 2){
        return "D";
    }
    else if (rating >= 1){
        return "F";
    }
    else {
        return "";
    }
  }

  /*
  * useEffect section
  * - simulates the synchronization between a website and external source (database)
  */
  useEffect(() => {

  }, [restaurantSelect]);

  useEffect(() => {

  }, [reviewIds]);

  useEffect(() => {
    restaurants.forEach((restaurant) => {
      let totalRating = 0.0;
      let totalReviewCount = 0.0;
      customerReviews.forEach((review) =>{
        if (review.restaurantId === restaurant.id){
          totalRating += review.rating;
          totalReviewCount += 1;
        }
      })
      updateRestaurantRatings(restaurant.id, totalRating / totalReviewCount, totalReviewCount)
    })
  }, [customerReviews]);

  useEffect(() => {
    if (reviewToBeEdited) {
      editForm.reset(
        {
          id: reviewToBeEdited.id,
          title: reviewToBeEdited.title,
          comment:  reviewToBeEdited.comment,
          rating: String(reviewToBeEdited.rating),
          customerName: reviewToBeEdited.customerName,
          restaurantID: String(reviewToBeEdited.restaurantId)
        }
      ); 
    }
  }, [reviewToBeEdited, editForm.reset]);

  // initialize restaurant data on startup
  useEffect(() => {
    
    const getRestaurants = async () => {
      const response = await fetch('http://localhost:3000/restaurant/all');
      const data: restaurant[] = await response.json();
      console.log(data);
      setRestaurants(data);
    }
    const getReviews = async () => {
      const response = await fetch('http://localhost:3000/customerReview/all');
      const data: CustomerReview[] = await response.json();
      console.log(data);
      setCustomerReviews(data);
    }
    getRestaurants();
    getReviews();
  

  },[])
  /*
  * - HTML + in-line TSX to create a single-page application.
  */
  return (
    <>
      <Tabs defaultValue="restaurants" className="w-[1200px]">
        <TabsList>
          <TabsTrigger value="restaurants">All Restaurants</TabsTrigger>
          <TabsTrigger value="reviews">All Reviews</TabsTrigger>
          <TabsTrigger value="create"> Create Review </TabsTrigger>
          <TabsTrigger value="upload-review-file"> Upload Review File </TabsTrigger>
        </TabsList>
        <TabsContent value="restaurants">
          <div className="grid grid-cols-6 gap-2">
            <div className="col-span-2">
              Click a restaurant card to display the reviews.
              <ul>
              { restaurants.length > 0 &&
                restaurants.map((restaurant) => {
                  return (
                      <li className="cursor-pointer" key={restaurant.id} id={String(restaurant.id)} onClick={handleRestaurantClick}>
                        <Card>
                          <CardHeader>
                            <CardTitle>{restaurant.name}</CardTitle>
                            <CardDescription>
                              <ul>
                                <li>{restaurant.type}</li>  
                                <li>
                                  {(!Number.isNaN(restaurant.rating)) && restaurant.rating.toFixed(1) + " (" + restaurant.ratingCount + ")"}
                                  {(Number.isNaN(restaurant.rating)) && "No reviews currently exist"}
                                </li>
                                <li>
                                {getRestaurantGrade(restaurant.rating).length > 0 &&
                                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                                  {getRestaurantGrade(restaurant.rating)}
                                </h1>
                                }
                                {getRestaurantGrade(restaurant.rating).length === 0 && "Grade non-existent."}
                                </li>
                              </ul>

                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <img src={"/restaurant-" + restaurant.id + ".jpg"}alt="picture"/>
                          </CardContent>
                          <CardFooter>

                          </CardFooter>
                        </Card>
                        
                        
                      </li>
                  )
                })
              }
              </ul>
            </div>

            <div className="col-span-4">
              Showing all reviews related to Restaurant <strong>{restaurants.length > 0 && restaurants[restaurantSelect].name}</strong>
              {getReviews(restaurantSelect).length === 0 && <p>There are currently no reviews for this restaurant </p>}
              
              {
                getReviews(restaurantSelect) && restaurants.length > 0 &&
                  getReviews(restaurantSelect).map((review) => {
                    return (
                        
                      <Card key={review.id} id={String(review.id)} className="w-4/5">
                      <CardHeader>
                        <CardTitle>{review.title}</CardTitle>
                        <CardDescription>{restaurants[review.restaurantId].name + " " + review.rating + " out of 5"}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="break-words whitespace-normal">
                          {review.comment}
                        </p>
                        
                      </CardContent>
                      <CardFooter className='justify-between'>
                        <ul>
                          <li>Review ID: {review.id}</li>
                          <li>Customer Name: {review.customerName}</li>
                          <li>Published: {review.publishDate}</li>
                          <li>Last Update: {review.lastUpdated}</li>
                        </ul>
                        <div>

                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button onClick={() => {setReviewToBeEdited(review);}} variant="destructive" >Delete</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[800px]">
                            <DialogHeader>
                              <DialogTitle>Delete review</DialogTitle>
                              <DialogDescription>
                                Delete a review. Click confirm if you're absolutely sure.
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...editForm}>
                            <form onSubmit={editForm.handleSubmit(onSubmitDelete)} className="space-y-8">
                              <div className="grid grid-cols-6 gap-2">
                                <div className="col-span-6">
                                  <FormField
                                  control={editForm.control}
                                  name="id"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>ID</FormLabel>
                                      <FormControl>
                                        <Input disabled={true} placeholder="Write your name or anyone else's here" {...field} />
                                      </FormControl>
                                      <FormDescription>
                                        
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                  />
                                </div>
                                <div className="col-span-6">
                                  <FormField
                                  control={editForm.control}
                                  name="customerName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Customer Name</FormLabel>
                                      <FormControl>
                                        <Input disabled={true} placeholder="Write your name or anyone else's here" {...field} />
                                      </FormControl>
                                      <FormDescription>
                                        
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                  />
                                </div>
                                <div className="col-span-3">
                                <FormField
                                  control={editForm.control}
                                  name="restaurantID"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Restaurant Name</FormLabel>
                                      <Select disabled={true} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="w-full">
                                            <SelectValue  placeholder="Select the rating for the restaurant" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="0">Gordon's Delight</SelectItem>
                                          <SelectItem value="1">Gordon's Trashcan</SelectItem>
                                          <SelectItem value="2">Gordon's Zoo</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormDescription>
                                        
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                </div>
                                <div className="col-span-3">
                                  <FormField
                                    control={editForm.control}
                                    name="rating"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Rating</FormLabel>
                                        <Select disabled={true} onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl>
                                            <SelectTrigger className="w-full overflow-hidden">
                                              <SelectValue  placeholder="Select the rating for the restaurant" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="1">1 - The worst restaurant ever.</SelectItem>
                                            <SelectItem value="2">2 - Below Mid</SelectItem>
                                            <SelectItem value="3">3 - Mid</SelectItem>
                                            <SelectItem value="4">4 - Slightly worse than the best Restaurant.</SelectItem>
                                            <SelectItem value="5">5 - The best restaurant ever.</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormDescription>
                                          
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="col-span-6">
                                    
                                  <FormField
                                    control={editForm.control}
                                    name="title"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                          <Input disabled={true} placeholder="This is the title of your review." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                          
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={editForm.control}
                                    name="comment"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Comment</FormLabel>
                                        <FormControl>
                                          <Textarea disabled={true} placeholder="Write a wonderful comment about your expereince." {...field}/>
                                        </FormControl>
                                        <FormDescription>
                                          
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            
                            <DialogFooter>
                              <Button className="float-right" variant="destructive" type="submit">Confirm</Button>
                            </DialogFooter>
                            </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button onClick={() => {setReviewToBeEdited(review);}} variant="outline">Edit</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                              <DialogTitle>Edit review</DialogTitle>
                              <DialogDescription>
                                Make changes to a review. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <Form {...editForm}>
                            <form onSubmit={editForm.handleSubmit(onSubmitUpdate)} className="space-y-8">
                              <div className="grid grid-cols-6 gap-2">
                                <div className="col-span-6">
                                  <FormField
                                  control={editForm.control}
                                  name="id"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>ID</FormLabel>
                                      <FormControl>
                                        <Input disabled={true} placeholder="Write your name or anyone else's here" {...field} />
                                      </FormControl>
                                      <FormDescription>
                                        
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                  />
                                </div>
                                <div className="col-span-6">
                                  <FormField
                                  control={editForm.control}
                                  name="customerName"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Customer Name</FormLabel>
                                      <FormControl>
                                        <Input disabled={true} placeholder="Write your name or anyone else's here" {...field} />
                                      </FormControl>
                                      <FormDescription>
                                        
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                  />
                                </div>
                                <div className="col-span-3">
                                <FormField
                                  control={editForm.control}
                                  name="restaurantID"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Restaurant Name</FormLabel>
                                      <Select  disabled={true} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select the rating for the restaurant" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="0">Gordon's Delight</SelectItem>
                                          <SelectItem value="1">Gordon's Trashcan</SelectItem>
                                          <SelectItem value="2">Gordon's Zoo</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormDescription>
                                        
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                </div>
                                <div className="col-span-3">
                                  <FormField
                                    control={editForm.control}
                                    name="rating"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Rating</FormLabel>
                                        <Select  onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl>
                                            <SelectTrigger className="w-full overflow-hidden">
                                              <SelectValue placeholder="Select the rating for the restaurant" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="1">1 - The worst restaurant ever.</SelectItem>
                                            <SelectItem value="2">2 - Below Mid</SelectItem>
                                            <SelectItem value="3">3 - Mid</SelectItem>
                                            <SelectItem value="4">4 - Slightly worse than the best Restaurant.</SelectItem>
                                            <SelectItem value="5">5 - The best restaurant ever.</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        <FormDescription>
                                          
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="col-span-6">
                                    
                                  <FormField
                                    control={editForm.control}
                                    name="title"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                          <Input disabled={true} placeholder="This is the title of your review." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                          
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={editForm.control}
                                    name="comment"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Comment</FormLabel>
                                        <FormControl>
                                          <Textarea placeholder="Write a wonderful comment about your expereince." {...field}/>
                                        </FormControl>
                                        <FormDescription>
                                          
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            
                            <DialogFooter>
                              <Button className="float-right" type="submit">Save changes</Button>
                            </DialogFooter>
                            </form>
                            </Form>
                          </DialogContent>
                        </Dialog>
                        </div>
                      </CardFooter>
                    </Card>

                    )
                  })

              }
                
              
            </div>
          </div>
          
        </TabsContent>
        <TabsContent value="reviews">
        <Card className="flex items-center">
              {customerReviews.length === 0 && <p>There are currently no reviews at all. </p>}
              {customerReviews.length > 0 && <p>All reviews are listed below.</p>}
              {
                customerReviews.length > 0 && restaurants.length > 0 &&
                customerReviews.map((review) => {
                    return (

                          <Card key={review.id} id={String(review.id)} className="w-4/5">
                            <CardHeader>
                              <CardTitle>{review.title}</CardTitle>
                              <CardDescription>{restaurants[review.restaurantId].name + " " + review.rating + " out of 5"}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="break-words whitespace-normal">
                                {review.comment}
                              </p>
                              
                            </CardContent>
                            <CardFooter className='justify-between'>
                              <ul>
                                <li>Review ID: {review.id}</li>
                                <li>Customer Name: {review.customerName}</li>
                                <li>Published: {review.publishDate}</li>
                                <li>Last Update: {review.lastUpdated}</li>
                              </ul>
                              <div>

                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button onClick={() => {setReviewToBeEdited(review);}} variant="destructive" >Delete</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px]">
                                  <DialogHeader>
                                    <DialogTitle>Delete review</DialogTitle>
                                    <DialogDescription>
                                      Delete a review. Click confirm if you're absolutely sure.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Form {...editForm}>
                                  <form onSubmit={editForm.handleSubmit(onSubmitDelete)} className="space-y-8">
                                    <div className="grid grid-cols-6 gap-2">
                                      <div className="col-span-6">
                                        <FormField
                                        control={editForm.control}
                                        name="id"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>ID</FormLabel>
                                            <FormControl>
                                              <Input disabled={true} placeholder="Write your name or anyone else's here" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                              
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                        />
                                      </div>
                                      <div className="col-span-6">
                                        <FormField
                                        control={editForm.control}
                                        name="customerName"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Customer Name</FormLabel>
                                            <FormControl>
                                              <Input disabled={true} placeholder="Write your name or anyone else's here" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                              
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                        />
                                      </div>
                                      <div className="col-span-3">
                                      <FormField
                                        control={editForm.control}
                                        name="restaurantID"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Restaurant Name</FormLabel>
                                            <Select disabled={true} onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                                <SelectTrigger className="w-full">
                                                  <SelectValue  placeholder="Select the rating for the restaurant" />
                                                </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                <SelectItem value="0">Gordon's Delight</SelectItem>
                                                <SelectItem value="1">Gordon's Trashcan</SelectItem>
                                                <SelectItem value="2">Gordon's Zoo</SelectItem>
                                              </SelectContent>
                                            </Select>
                                            <FormDescription>
                                              
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      </div>
                                      <div className="col-span-3">
                                        <FormField
                                          control={editForm.control}
                                          name="rating"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Rating</FormLabel>
                                              <Select disabled={true} onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                  <SelectTrigger className="w-full overflow-hidden">
                                                    <SelectValue  placeholder="Select the rating for the restaurant" />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  <SelectItem value="1">1 - The worst restaurant ever.</SelectItem>
                                                  <SelectItem value="2">2 - Below Mid</SelectItem>
                                                  <SelectItem value="3">3 - Mid</SelectItem>
                                                  <SelectItem value="4">4 - Slightly worse than the best Restaurant.</SelectItem>
                                                  <SelectItem value="5">5 - The best restaurant ever.</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <FormDescription>
                                                
                                              </FormDescription>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      <div className="col-span-6">
                                          
                                        <FormField
                                          control={editForm.control}
                                          name="title"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Title</FormLabel>
                                              <FormControl>
                                                <Input disabled={true} placeholder="This is the title of your review." {...field} />
                                              </FormControl>
                                              <FormDescription>
                                                
                                              </FormDescription>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={editForm.control}
                                          name="comment"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Comment</FormLabel>
                                              <FormControl>
                                                <Textarea disabled={true} placeholder="Write a wonderful comment about your expereince." {...field}/>
                                              </FormControl>
                                              <FormDescription>
                                                
                                              </FormDescription>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                  
                                  <DialogFooter>
                                    <Button className="float-right" variant="destructive" type="submit">Confirm</Button>
                                  </DialogFooter>
                                  </form>
                                  </Form>
                                </DialogContent>
                              </Dialog>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button onClick={() => {setReviewToBeEdited(review);}} variant="outline">Edit</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[525px]">
                                  <DialogHeader>
                                    <DialogTitle>Edit review</DialogTitle>
                                    <DialogDescription>
                                      Make changes to a review. Click save when you're done.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Form {...editForm}>
                                  <form onSubmit={editForm.handleSubmit(onSubmitUpdate)} className="space-y-8">
                                    <div className="grid grid-cols-6 gap-2">
                                      <div className="col-span-6">
                                        <FormField
                                        control={editForm.control}
                                        name="id"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>ID</FormLabel>
                                            <FormControl>
                                              <Input disabled={true} placeholder="Write your name or anyone else's here" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                              
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                        />
                                      </div>
                                      <div className="col-span-6">
                                        <FormField
                                        control={editForm.control}
                                        name="customerName"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Customer Name</FormLabel>
                                            <FormControl>
                                              <Input disabled={true} placeholder="Write your name or anyone else's here" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                              
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                        />
                                      </div>
                                      <div className="col-span-3">
                                      <FormField
                                        control={editForm.control}
                                        name="restaurantID"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Restaurant Name</FormLabel>
                                            <Select  disabled={true} onValueChange={field.onChange} defaultValue={field.value}>
                                              <FormControl>
                                                <SelectTrigger className="w-full">
                                                  <SelectValue placeholder="Select the rating for the restaurant" />
                                                </SelectTrigger>
                                              </FormControl>
                                              <SelectContent>
                                                <SelectItem value="0">Gordon's Delight</SelectItem>
                                                <SelectItem value="1">Gordon's Trashcan</SelectItem>
                                                <SelectItem value="2">Gordon's Zoo</SelectItem>
                                              </SelectContent>
                                            </Select>
                                            <FormDescription>
                                              
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      </div>
                                      <div className="col-span-3">
                                        <FormField
                                          control={editForm.control}
                                          name="rating"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Rating</FormLabel>
                                              <Select  onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                  <SelectTrigger className="w-full overflow-hidden">
                                                    <SelectValue placeholder="Select the rating for the restaurant" />
                                                  </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                  <SelectItem value="1">1 - The worst restaurant ever.</SelectItem>
                                                  <SelectItem value="2">2 - Below Mid</SelectItem>
                                                  <SelectItem value="3">3 - Mid</SelectItem>
                                                  <SelectItem value="4">4 - Slightly worse than the best Restaurant.</SelectItem>
                                                  <SelectItem value="5">5 - The best restaurant ever.</SelectItem>
                                                </SelectContent>
                                              </Select>
                                              <FormDescription>
                                                
                                              </FormDescription>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                      <div className="col-span-6">
                                          
                                        <FormField
                                          control={editForm.control}
                                          name="title"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Title</FormLabel>
                                              <FormControl>
                                                <Input disabled={true} placeholder="This is the title of your review." {...field} />
                                              </FormControl>
                                              <FormDescription>
                                                
                                              </FormDescription>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={editForm.control}
                                          name="comment"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Comment</FormLabel>
                                              <FormControl>
                                                <Textarea placeholder="Write a wonderful comment about your expereince." {...field}/>
                                              </FormControl>
                                              <FormDescription>
                                                
                                              </FormDescription>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                  
                                  <DialogFooter>
                                    <Button className="float-right" type="submit">Save changes</Button>
                                  </DialogFooter>
                                  </form>
                                  </Form>
                                </DialogContent>
                              </Dialog>
                              </div>
                            </CardFooter>
                          </Card>

                    )
                  })
              }
          </Card>
        </TabsContent>
        <TabsContent value="create">
            
            <div className="grid grid-cols-6">
              <div></div>
              <div className="col-span-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Create a review</CardTitle>
                    <CardDescription></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <div className="grid grid-cols-6 gap-2">
                        <div className="col-span-6">
                          <FormField
                          control={form.control}
                          name="customerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Customer Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Write your name or anyone else's here" {...field} />
                              </FormControl>
                              <FormDescription>
                                
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                          />
                        </div>
                        <div className="col-span-3">
                        <FormField
                          control={form.control}
                          name="restaurantID"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Restaurant Name</FormLabel>
                              <Select  onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select the rating for the restaurant" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="0">Gordon's Delight</SelectItem>
                                  <SelectItem value="1">Gordon's Trashcan</SelectItem>
                                  <SelectItem value="2">Gordon's Zoo</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        </div>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <Select  onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select the rating for the restaurant" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="1">1 - The worst restaurant ever.</SelectItem>
                                    <SelectItem value="2">2 - Below Mid</SelectItem>
                                    <SelectItem value="3">3 - Mid</SelectItem>
                                    <SelectItem value="4">4 - Slightly worse than the best Restaurant.</SelectItem>
                                    <SelectItem value="5">5 - The best restaurant ever.</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-6">
                            
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="This is the title of your review." {...field} />
                                </FormControl>
                                <FormDescription>
                                  
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Write a wonderful comment about your expereince." {...field}/>
                                </FormControl>
                                <FormDescription>
                                  
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <Button type="submit">Submit</Button>
                    </form>
                    </Form>
                  </CardContent>
                  <CardFooter>
                  </CardFooter>
                </Card>
                
              </div>
            </div>
            
        </TabsContent>
        <TabsContent value="upload-review-file">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="reviewFile">Place your input file of reviews below.</Label>
            <Input id="reviewFile" ref={fileInputRef} type="file" />

            <Button onClick={handleOnUpload} type="submit">Upload</Button>
          </div>
        </TabsContent>
      </Tabs>
      <Toaster richColors  closeButton />
    </>
  )
}

export default App
