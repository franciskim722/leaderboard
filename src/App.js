import React from 'react';
import { Box, Button, Container, Input, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

const MyTableHead = styled(TableHead)({
  background: 'blue',
})

const MyInput = styled(Input)({
  margin: '0 .5rem'
})

const MyButton = styled(Button)({
  margin: '1rem 0'
})

const AddUserContainer = styled(Container)({
  padding: '1rem 0',
})

// Constants...
const APP_TITLE = 'Friday Fun Leaderboard'
const ADD_USER = 'Add User'
const BOLD_FONT_WEIGHT = 'fontWeightBold'
const LOADING = "Loading..."

const FIRST_NAME = 'First Name'
const LAST_NAME = 'Last Name'
const TEAM = 'Team'
const SCORE = 'Score'

const TABLE_HEAD_TYPE = 'span'

const DB_URL_PLAYERS = 'http://localhost:5000/players'
const DB_URL_TEAM = 'http://localhost:5000/teams'

const TEAMS = [
  {
    id: 44,
    name: "Crushers"
  },
  {
    id: 88,
    name: "Ferries"
  },
  {
    id: 99,
    name: "Walruses"
  }
]

const FORM_IDS = {
  SCORE: 'score',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName'
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      players: null,
      teams: null,
      newPlayer: {
        id: null,
        firstName: '',
        lastName: '',
        score: null,
        teamId: TEAMS[0].id
      }
    }
    this.onInputChange = this.onInputChange.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }

  sortPlayersByScore(players) {
    players.sort((a, b) => (b.score - a.score))
    this.setState({ players })
  }

  mapTeamName(teamId) {
    const { teams } = this.state
    for (let i = 0; i < teams.length; i++) {
      if (teamId === teams[i].id) {
        return teams[i].name
      }
    }
  }

  componentDidMount() {
    // Get Teams
    fetch(DB_URL_TEAM)
      .then(res => res.json())
      .then(teams => this.setState({ teams }))
      .then(() => {
        fetch(DB_URL_PLAYERS)
          .then(res => res.json())
          .then(players => this.sortPlayersByScore(players))
          .then(() => this.setState({ isLoading: false }))
      })
  }

  onInputChange(e) {
    const { newPlayer } = this.state
    let updatedPlayer = { ...newPlayer }
    updatedPlayer[e.target.name] = e.target.value
    this.setState({ newPlayer: updatedPlayer })
  }

  onSelectChange(e) {
    const { newPlayer } = this.state
    let updatedPlayer = { ...newPlayer }
    updatedPlayer.teamId = e.target.value
    this.setState({ newPlayer: updatedPlayer })
  }

  onFormSubmit() {
    // Logs formatted new player to persist...
    console.log(this.state.newPlayer)
  }

  render() {
    const { isLoading, players } = this.state
    if (isLoading) return LOADING
    return (
      <Container>
        <Typography variant="h4" component="h1">
          {APP_TITLE}
        </Typography>
        <AddUserContainer>
          <form>
            <MyInput placeholder={SCORE} name={FORM_IDS.SCORE} onChange={this.onInputChange} />
            <MyInput placeholder={FIRST_NAME} name={FORM_IDS.FIRST_NAME} onChange={this.onInputChange} />
            <MyInput placeholder={LAST_NAME} name={FORM_IDS.LAST_NAME} onChange={this.onInputChange} />
            <Select
              value={TEAMS[0].id}
              onChange={this.onSelectChange}
            >
              {TEAMS.map(({ id, name }) => (
                <MenuItem key={id} value={id}>{name}</MenuItem>
              ))}
            </Select>
          </form>
          <MyButton variant="contained" onClick={this.onFormSubmit}>{ADD_USER}</MyButton>
        </AddUserContainer>
        <TableContainer>
          <Table>
            <MyTableHead>
              <TableRow>
                <TableCell>
                  <Typography component={TABLE_HEAD_TYPE}>
                    <Box fontWeight={BOLD_FONT_WEIGHT}>
                      {SCORE}
                    </Box>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography component={TABLE_HEAD_TYPE}>
                    <Box fontWeight={BOLD_FONT_WEIGHT}>
                      {FIRST_NAME}
                    </Box>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography component={TABLE_HEAD_TYPE}>
                    <Box fontWeight={BOLD_FONT_WEIGHT}>
                      {LAST_NAME}
                    </Box>
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography component={TABLE_HEAD_TYPE}>
                    <Box fontWeight={BOLD_FONT_WEIGHT}>
                      {TEAM}
                    </Box>
                  </Typography>
                </TableCell>
              </TableRow>
            </MyTableHead>
            <TableBody>
              {players.map(({ score, firstName, lastName, teamId }, i) => (
                <TableRow key={i}>
                  <TableCell>{score}</TableCell>
                  <TableCell>{firstName}</TableCell>
                  <TableCell>{lastName}</TableCell>
                  <TableCell>{this.mapTeamName(teamId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    )
  }
}

export default App;
