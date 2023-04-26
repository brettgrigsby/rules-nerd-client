import Head from "next/head"
import { Inter } from "next/font/google"
import { useState } from "react"
import {
  Box,
  Flex,
  FormLabel,
  Heading,
  Input,
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  const [question, setQuestion] = useState("")
  const [questions, setQuestions] = useState<string[]>([])
  const [responses, setResponses] = useState<string[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuestion(val)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setQuestions([...questions, question])
    setQuestion("")
    const response = fetch("http://127.0.0.1:5000/question", {
      method: "POST",
      body: JSON.stringify({ question }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setResponses((prev) => [...prev, res.answer]))
      .catch((err) => console.log(err))
  }

  const qAndAs = questions.map((q, i) => {
    return {
      question: q,
      answer: responses[i],
    }
  })

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
          height="100vh"
          overflow="auto"
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
          <Flex flexDirection="column" maxWidth={[null, "50%"]}>
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
            {qAndAs.length > 0 &&
              qAndAs.reverse().map(({ question, answer }, i) => {
                return (
                  <Box key={`${question}`}>
                    <Text
                      mt={4}
                      backgroundColor="blackAlpha.800"
                      borderRadius="md"
                      p={2}
                      fontSize="lg"
                      color="whiteAlpha.900"
                      maxWidth="70%"
                      mr="auto"
                      fontWeight="bold"
                    >
                      {question}
                    </Text>
                    <Text
                      mt={4}
                      backgroundColor="blackAlpha.800"
                      borderRadius="md"
                      p={2}
                      fontSize="lg"
                      color="whiteAlpha.900"
                      maxWidth="70%"
                      ml="auto"
                    >
                      {answer || <Spinner size="sm" />}
                    </Text>
                  </Box>
                )
              })}
          </Flex>
        </Box>
      </main>
    </>
  )
}
