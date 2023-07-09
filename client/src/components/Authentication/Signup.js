import React from 'react'
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ChatState } from '../../Context/chatProvider';
const Signup = () => {
 
  const [show_1, setShow_1] = useState(false);
  const [show_2, setShow_2] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const { setUser } = ChatState();

  const handleClick_1 = () => setShow_1(!show_1);
  const handleClick_2 = () => setShow_2(!show_2);

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset","mernChatApp");
      data.append("cloud_name","dj6tcbajj");
      fetch("https://api.cloudinary.com/v1_1/dj6tcbajj/image/upload",{
        method:"post",
        body:data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select JPEG or PNG format",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Password Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );

      toast({
        title: "Registration Successful, Redirecting",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      return;
    }
  };

  return (
    <VStack spacing="5px">
    <FormControl id="first-name" isRequired>
      <FormLabel textColor={'white'}>Name</FormLabel>
      <Input
        borderColor={'#2C333F'}
        textColor={'white'}
        placeholder="Enter Your Name" rounded={'2xl'}
        onChange={(e) => setName(e.target.value)}
      />
    </FormControl>
    <FormControl id="email" isRequired>
      <FormLabel textColor={'white'}>Email Address</FormLabel>
      <Input
        borderColor={'#2C333F'}
        textColor={'white'}
        type="email"
        placeholder="Enter Your Email Address"
        rounded={'2xl'}
        onChange={(e) => setEmail(e.target.value)}
      />
    </FormControl>

    <FormControl id="password" isRequired>
      <FormLabel textColor={'white'}>Password</FormLabel>
      <InputGroup size="md">
        <Input
          borderColor={'#2C333F'}
        textColor={'white'}
          type={show_1 ? "text" : "password"}
          placeholder="Enter Password"
          rounded={'2xl'}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm"  rounded={'2xl'} onClick={handleClick_1}>
            {show_1 ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>

    <FormControl id="password" isRequired>
      <FormLabel textColor={'white'}>Confirm Password</FormLabel>
      <InputGroup size="md">
        <Input
          borderColor={'#2C333F'}
        textColor={'white'}
         rounded={'2xl'}
          type={show_2 ? "text" : "password"}
          placeholder="Confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem"  rounded={'2xl'} size="sm" onClick={handleClick_2}>
            {show_2 ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>

    <FormControl id="pic">
      <FormLabel textColor={'white'}>Upload your Picture</FormLabel>
      <Input
        borderColor={'#2C333F'}
        textColor={'white'}
       rounded={'2xl'}
        type="file"  
        p={1.5}
        accept="image/*"
        onChange={(e) => postDetails(e.target.files[0])}
      />
    </FormControl>
    <Button
      colorScheme="blue"
      width="100%"
      style={{ marginTop: 15 }}
      onClick={submitHandler}
      isLoading={loading}
      rounded={'2xl'}
    >
      Sign Up
    </Button>
  </VStack>
    

  )
}

export default Signup