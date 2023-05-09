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
  Flex,
  FormLabel,
  FormControl,
  Heading,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { SearchIcon } from "@chakra-ui/icons"
import { ChakraStylesConfig, Select, SingleValue } from "chakra-react-select"

const inter = Inter({ subsets: ["latin"] })

type GameOption = {
  label: string
  value: string
}

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

  const handleGameChange = (newValue: unknown) => {
    const val = (newValue as GameOption)?.value
    if (!val) return
    setGame(val)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setQuestions([...questions, question])
    const input = document.getElementById("question-input") as HTMLInputElement
    input?.blur()
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

  useEffect(() => {
    fetch("https://rules-nerd-node-server.herokuapp.com/supported-games")
      // fetch("http://localhost:4000/supported-games")
      .then((res) => res.json())
      .then((res) => {
        setGameOptions(res.games.sort())
        setGame(res.games.sort()[0])
      })
      .catch((err) => console.log(err))
  }, [])

  const qAndAs = questions.map((q, i) => {
    return {
      question: q,
      response: responses[i],
    }
  })

  const options = (gameOptions || []).map((game) => ({
    label: kebabCaseToCapitalizedWords(game),
    value: game,
  }))
  const chakraStyles: ChakraStylesConfig = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "blackAlpha.200",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "blackAlpha.500",
    }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: "rgb(232, 232, 229)",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "blackAlpha.200" : "transparent",
    }),
  }
  return (
    <>
      <Head>
        <title>Rules Nerd</title>
        <meta property="og:title" content="Rules Nerd" />
        <meta
          name="description"
          content="A friendly AI to answer all your game rules questions"
        />
        <meta
          property="og:description"
          content="A friendly AI to answer all your game rules questions"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          property="og:image"
          content="https://rulesnerd.com/preview-image.png"
        />
        <meta property="og:url" content="https://www.rulesnerd.com/" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Rules Nerd" />
        <meta
          name="twitter:description"
          content="A friendly AI to answer all your game rules questions"
        />
        <meta
          name="twitter:image"
          content="https://rulesnerd.com/preview-image.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.rulesnerd.com/" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box
          height="100vh"
          overflow="auto"
          backgroundImage="/nerd-mascot.png"
          backgroundPosition="bottom right"
          backgroundSize={["100%", "70%", "55%", "50%"]}
          backgroundRepeat="no-repeat"
          backgroundColor="rgb(252, 252, 248)"
          color="blackAlpha.900"
          p={2}
        >
          <Heading fontWeight="bold" mb={4}>
            The Rules Nerd
          </Heading>
          <Flex flexDirection="column" maxWidth={[null, null, "50%"]}>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <FormControl>
                  <FormLabel>Game</FormLabel>
                  <Select
                    id="game-select"
                    name="games"
                    options={options}
                    placeholder="Select game..."
                    selectedOptionStyle="check"
                    selectedOptionColorScheme="blackAlpha"
                    onChange={handleGameChange}
                    chakraStyles={chakraStyles}
                  />
                </FormControl>
              </Box>
              <FormLabel htmlFor="question">Ask your stupid question</FormLabel>
              <Flex>
                <Input
                  id="question-input"
                  value={question}
                  onChange={handleChange}
                  type="textbox"
                  placeholder="ask away"
                  backgroundColor="blackAlpha.200"
                  _placeholder={{ color: "blackAlpha.500" }}
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
                  <Box key={`${question}-${response?.answer}`}>
                    <Box
                      mt={4}
                      backgroundColor="blackAlpha.900"
                      borderRadius="md"
                      px={4}
                      py={2}
                      mr="auto"
                      maxWidth="70%"
                    >
                      <Text
                        fontSize="lg"
                        color="whiteAlpha.900"
                        fontStyle="italic"
                      >
                        {question}
                      </Text>
                    </Box>
                    <Box
                      mt={4}
                      backgroundColor="blackAlpha.900"
                      borderRadius="md"
                      px={4}
                      py={2}
                      fontSize="lg"
                      color="whiteAlpha.900"
                      maxWidth="70%"
                      ml="auto"
                    >
                      <Text>{response?.answer || <Spinner size="sm" />}</Text>
                      {response?.sources && (
                        <Accordion allowToggle>
                          <AccordionItem border="none">
                            <Flex justify="flex-end" align="center">
                              <AccordionButton p={0} w="fit-content">
                                <Text fontSize="2xs">Show Sources</Text>
                                <AccordionIcon />
                              </AccordionButton>
                            </Flex>
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
        <Flex
          w={["100%", null, "50%"]}
          align="center"
          position="fixed"
          bottom={0}
          left={0}
          color={["whiteAlpha.900", null, "gray.500"]}
          fontSize="xs"
          p={1}
          backgroundColor={["blackAlpha.800", null, "transparent"]}
        >
          <Text>feedback, questions, or game requests? </Text>
          <Text fontWeight="bold" ml={1}>
            <a
              href="mailto:gbrett@gmail.com?subject=Rules%20Nerd%20Feedback"
              target="_blank"
            >
              Email me
            </a>
          </Text>
        </Flex>
      </main>
    </>
  )
}
