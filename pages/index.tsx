import Head from "next/head"
import { Inter } from "next/font/google"
import { useState } from "react"
import { Box, FormLabel, Heading, Input, Select, Text } from "@chakra-ui/react"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuestion(val)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setQuestion("")
    const response = fetch("http://127.0.0.1:5000/question", {
      method: "POST",
      body: JSON.stringify({ question }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setResponse(res.answer))
      .catch((err) => console.log(err))
  }

  return (
    <>
      <Head>
        <title>Rules Nerd</title>
        <meta
          name="description"
          content="A friendly AI to answer all your game rules questions"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box
          minHeight="100vh"
          backgroundImage="/nerd-mascot.png"
          backgroundPosition="bottom right"
          backgroundSize={["100%", "50%"]}
          backgroundRepeat="no-repeat"
          backgroundColor="rgb(252, 252, 248)"
          color="blackAlpha.900"
          p={2}
        >
          <Heading fontWeight="bold" mb={4}>
            The Rules Nerd
          </Heading>
          <Box maxWidth={[null, "50%"]}>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <FormLabel>Game</FormLabel>
                <Select backgroundColor="blackAlpha.200">
                  <option>Magic: The Gathering</option>
                </Select>
              </Box>
              <FormLabel htmlFor="question">Ask your stupid question</FormLabel>
              <Input
                value={question}
                onChange={handleChange}
                type="textbox"
                placeholder="ask away"
                backgroundColor="blackAlpha.200"
              />
            </form>
            {response && (
              <Text
                mt={4}
                backgroundColor="blackAlpha.700"
                borderRadius="md"
                p={2}
                fontSize="lg"
                color="whiteAlpha.900"
              >
                {response}
              </Text>
            )}
          </Box>
        </Box>
      </main>
    </>
  )
}
