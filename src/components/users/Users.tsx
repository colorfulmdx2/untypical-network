import {
    Avatar,
    Badge,
    Box, CardActionArea,
    createStyles, Fade,
    Grid, Grow, IconButton,
    makeStyles,
    Paper,
    Theme,
    Typography,
    withStyles
} from '@material-ui/core'
import React, {useState} from 'react'
import {useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {UserType} from "../../redux/reducer";
import {grey, indigo, red} from "@material-ui/core/colors";
import DeleteIcon from '@material-ui/icons/Delete';
import { Card } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import AssignmentIcon from '@material-ui/icons/Assignment';
import WcIcon from '@material-ui/icons/Wc';
import Alert from "@material-ui/lab/Alert";

export const UsersTable = () => {

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            container: {
                margin: '50px auto 0 auto',
                [theme.breakpoints.down('xl')]: {
                    width: '80%'
                },
                [theme.breakpoints.down('lg')]: {
                    width: '80%'
                },
                [theme.breakpoints.down('md')]: {
                    width: '80%'
                },
                [theme.breakpoints.down('sm')]: {
                    width: '95%'
                },
                [theme.breakpoints.down('xs')]: {
                    width: '100%'
                },
                search: {
                    width: '100%',
                }
            },

        }),
    );

    const classes = useStyles()

    const users = useSelector<AppStateType, UserType[]>(state => state.reducer.users)

    return (
        <>

            <Grid container spacing={3} className={classes.container}>
                {
                    users.map((e: UserType) => {
                        return <User name={e.name}
                                     id={e.id}
                                     key={e.id}
                                     email={e.email}
                                     sex={e.sex}
                        />
                    })
                }
            </Grid>
        </>
    )
}

const StyledBadge = withStyles((theme: Theme) =>
    createStyles({
        badge: {
            backgroundColor: '#44b700',
            color: '#44b700',
            boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                animation: '$ripple 1.2s infinite ease-in-out',
                border: '1px solid currentColor',
                content: '""',
            },
        },
        '@keyframes ripple': {
            '0%': {
                transform: 'scale(.8)',
                opacity: 1,
            },
            '100%': {
                transform: 'scale(2.4)',
                opacity: 0,
            },
        },
    }),
)(Badge);

//----------------------------------------------------------------------------------------------------------------------

const User = (props: UserType) => {
    const {darkMode, languagePackage, lang, auth} = useSelector<AppStateType, any>(state => state.reducer)


    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            box: {
                background: darkMode ? grey[900] : grey[300],
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: 150,
                padding: 20,

            },
            delete: {
                color: red[500],
                fontSize: 20

            },
            deleteButton: {
                position: 'absolute',
                top: 10,
                right: 10,
                zIndex: 100
            },
            typography: {
                width: '100%',

            },
            icon: {
                marginRight: 60
            },
            alert: {
                position: 'absolute',
                top: 150,
                left: 0,
                right: 0,
                margin: '0 auto',
                width: 320,
                zIndex: 101
            },
            card: {
                position: 'relative'
            }


        }),
    );

    const classes = useStyles()

    const deleteButtonHandler = () => {
        if (!auth) {
            setInfo(true)
        } else {
            //some logic
        }
    }
    const [info, setInfo] = useState(false)

    return (
        <Fade in={true}>
            <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
                <Grow in={info}>
                    <Alert className={classes.alert}
                           severity="info"
                           onClose={() => setInfo(false)}
                    >{languagePackage[lang].deleteUserNotification}</Alert>
                </Grow>
                <Card className={classes.card}>
                    <IconButton aria-label="delete"
                                className={classes.deleteButton}
                                onClick={deleteButtonHandler}
                    >
                        <DeleteIcon color='primary'
                                    className={classes.delete}/>
                    </IconButton>
                    <CardActionArea>
                        <Paper className={classes.box}>
                            <StyledBadge
                                overlap="circle"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                variant="dot"
                            >
                                <Avatar>{props.name.substr(0, 1)}</Avatar>
                            </StyledBadge>
                            <Typography className={classes.typography}><AssignmentIcon className={classes.icon} />{props.name}</Typography>
                            <Typography className={classes.typography}><EmailIcon className={classes.icon} />{props.email}</Typography>
                            <Typography className={classes.typography}><WcIcon className={classes.icon} />{props.sex}</Typography>



                        </Paper>
                    </CardActionArea>
                </Card>
            </Grid>
        </Fade>
    )
}


function useStyles() {
    throw new Error('Function not implemented.');
}
