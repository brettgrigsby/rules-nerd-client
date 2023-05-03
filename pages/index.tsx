import Head from "next/head"
import { Inter } from "next/font/google"
import { useState } from "react"
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
  const [game, setGame] = useState<string>("android-netrunner")
  const [question, setQuestion] = useState("")
  const [questions, setQuestions] = useState<string[]>([])
  const [responses, setResponses] = useState<
    { answer: string; sources: string[] }[]
  >([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuestion(val)
  }

  const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setGame(val)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setQuestions([...questions, question])
    setQuestion("")
    fetch("https://rules-nerd-node-server.herokuapp.com/query", {
      // fetch("http://localhost:4000/query", {
      method: "POST",
      body: JSON.stringify({ query: question, game }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setResponses((prev) => [...prev, res]))
      .catch((err) => console.log(err))
  }

  const qAndAs = questions.map((q, i) => {
    return {
      question: q,
      response: responses[i],
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
                <Select
                  onChange={handleGameChange}
                  backgroundColor="blackAlpha.200"
                >
                  <option value="android-netrunner">Android Netrunner</option>
                  <option value="magic-the-gathering">
                    Magic: The Gathering
                  </option>
                  <option value="munchkin">Munchkin</option>
                  <option value="twilight-struggle">Twilight Struggle</option>
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
              qAndAs.reverse().map(({ question, response }, i) => {
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
                    <Box
                      mt={4}
                      backgroundColor="blackAlpha.800"
                      borderRadius="md"
                      p={2}
                      fontSize="lg"
                      color="whiteAlpha.900"
                      maxWidth="70%"
                      ml="auto"
                    >
                      <Text>{response?.answer || <Spinner size="sm" />}</Text>
                      {response?.sources && (
                        <Accordion allowToggle>
                          <AccordionItem border="none">
                            <Text>
                              <Flex justify="flex-end" align="center">
                                <Text fontSize="2xs">Show Sources</Text>
                                <AccordionButton w="fit-content">
                                  <AccordionIcon />
                                </AccordionButton>
                              </Flex>
                            </Text>
                            <AccordionPanel pb={4}>
                              {response.sources.map((source) => (
                                <Text mb={2} fontSize="xs" key={source}>
                                  {source}
                                </Text>
                              ))}
                            </AccordionPanel>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </Box>
                  </Box>
                )
              })}
          </Flex>
        </Box>
      </main>
    </>
  )
}
