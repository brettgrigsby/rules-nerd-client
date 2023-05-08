import Head from "next/head"
import { Inter } from "next/font/google"
import { useEffect, useState } from "react"
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"

const inter = Inter({ subsets: ["latin"] })

function kebabCaseToCapitalizedWords(input: string): string {
  return input
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function Home() {
  const [game, setGame] = useState<string>("")
  const [gameOptions, setGameOptions] = useState<string[]>([])
  const [question, setQuestion] = useState("")
  const [questions, setQuestions] = useState<string[]>([])
  const [responses, setResponses] = useState<
    { answer: string; sources: string[] }[]
  >([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuestion(val)
  }

  // const handleGameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const val = e.target.value
  //   setGame(val)
  // }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setQuestions([...questions, question])
    const input = document.getElementById("question-input") as HTMLInputElement
    input?.blur()
    setQuestion("")
    fetch("https://rules-nerd-node-server.herokuapp.com/query", {
      // fetch("http://localhost:4000/query", {
      method: "POST",
      body: JSON.stringify({ query: question, game: "vmlynr" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setResponses((prev) => [...prev, res]))
      .catch((err) => console.log(err))
  }

  // useEffect(() => {
  //   fetch("https://rules-nerd-node-server.herokuapp.com/supported-games")
  //     // fetch("http://localhost:4000/supported-games")
  //     .then((res) => res.json())
  //     .then((res) => {
  //       setGameOptions(res.games.sort())
  //       setGame(res.games.sort()[0])
  //     })
  //     .catch((err) => console.log(err))
  // }, [])

  const qAndAs = questions.map((q, i) => {
    return {
      question: q,
      response: responses[i],
    }
  })

  return (
    <>
      <Head>
        <title>VMLY&R Sandbox</title>
        <meta
          name="description"
          content="A friendly AI to answer all your questions"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <meta
          property="og:image"
          content="https://rulesnerd.com/preview-image.png"
        ></meta> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box
          height="100vh"
          overflow="auto"
          // backgroundImage="/nerd-mascot.png"
          // backgroundPosition="bottom right"
          // backgroundSize={["100%", "50%"]}
          // backgroundRepeat="no-repeat"
          backgroundColor="rgb(252, 252, 248)"
          color="blackAlpha.900"
          p={2}
        >
          <Heading fontWeight="bold" mb={4} textAlign="center">
            VMLY&R Sandbox
          </Heading>
          <Flex flexDirection="column" m="auto" maxWidth={[null, "75%", "50%"]}>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                {/* <FormLabel>Game</FormLabel>
                <Select
                  onChange={handleGameChange}
                  backgroundColor="blackAlpha.200"
                >
                  {gameOptions.map((game) => (
                    <option key={game} value={game}>
                      {kebabCaseToCapitalizedWords(game)}
                    </option>
                  ))}
                </Select> */}
              </Box>
              <FormLabel htmlFor="question">Ask your question</FormLabel>
              <Flex>
                <Input
                  id="question-input"
                  value={question}
                  onChange={handleChange}
                  type="textbox"
                  placeholder="ask away"
                  backgroundColor="blackAlpha.200"
                />
                <IconButton
                  type="submit"
                  aria-label="Search rules"
                  icon={<SearchIcon />}
                  backgroundColor="blackAlpha.200"
                  ml={1}
                />
              </Flex>
            </form>
            {qAndAs.length > 0 &&
              qAndAs.reverse().map(({ question, response }, i) => {
                return (
                  <Box key={`${question}`}>
                    <Text
                      mt={4}
                      backgroundColor="blackAlpha.900"
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
                      backgroundColor="blackAlpha.900"
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
