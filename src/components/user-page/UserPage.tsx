import React, {useState} from "react";
import {
    Avatar,
    Badge,
    Card,
    createStyles,
    Fade,
    Grid,
    Grow,
    IconButton,
    makeStyles,
    Paper,
    Theme,
    Typography,
    withStyles
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/store";
import {grey, red, yellow} from "@material-ui/core/colors";
import {deleteUser, UserType} from "../../redux/reducer";
import {UserModal} from "../modal/UserModal";
import Alert from "@material-ui/lab/Alert";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AssignmentIcon from "@material-ui/icons/Assignment";
import EmailIcon from "@material-ui/icons/Email";
import WcIcon from "@material-ui/icons/Wc";
import {useHistory, useParams} from "react-router-dom";

type UserPagePropsType = {
    users: UserType[]
}

export const UserPage = React.memo((props: UserPagePropsType) => {

    const [info, setInfo] = useState(false)
    const {darkMode, languagePackage, lang, auth} = useSelector<AppStateType, any>(state => state.reducer)
    const [open, setOpen] = useState(false)


    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            box: {
                background: darkMode ? grey[900] : grey[300],
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
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
            edit: {
                color: yellow[500],
                fontSize: 20
            },
            editButton: {
                position: 'absolute',
                top: 10,
                right: 50,
                zIndex: 100
            },
            typography: {
                width: '100%',

            },
            icon: {
                marginRight: 60,
                [theme.breakpoints.down('md')]: {
                    marginRight: 30,
                }
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
                position: 'relative',
                width: '80%',
                height: '80%',
                margin: '0 auto'
            }


        }),
    );

    const classes = useStyles()
    const dispatch = useDispatch()
    const params = useParams<{ id: string }>()
    const history = useHistory()

    const user = props.users.find(e => e.id === params.id)

    const deleteButtonHandler = () => {
        if (!auth) {
            setInfo(true)
        } else {
            const confirmValue = window.confirm(languagePackage[lang].deleteConfirm)
            confirmValue && dispatch(deleteUser(params.id)) && history.push('/')
        }
    }

    const editButtonHandler = () => {
        if (!auth) {
            setInfo(true)
        } else {
            handleModalOpen()
        }
    }

    const handleModalClose = () => {
        setOpen(false)
    };
    const handleModalOpen = () => {
        setOpen(true)
    };

    return (
        <Fade in={true}>
            <Grid item style={{marginTop: 70}}>
                <UserModal isOpen={open}
                           handleClose={handleModalClose}
                           handleOpen={handleModalOpen}
                           user={user}
                />
                <Grow in={info}>
                    <Alert className={classes.alert}
                           severity="info"
                           onClose={() => setInfo(false)}
                    >{languagePackage[lang].notification}</Alert>
                </Grow>
                <Card className={classes.card}>
                    <IconButton aria-label="delete"
                                className={classes.deleteButton}
                                onClick={deleteButtonHandler}
                    >
                        <DeleteIcon color='primary'
                                    className={classes.delete}/>
                    </IconButton>
                    <IconButton aria-label="edit"
                                className={classes.editButton}
                                onClick={editButtonHandler}
                    >
                        <EditIcon color='primary'
                                  className={classes.edit}/>
                    </IconButton>
                    <Paper className={classes.box}>
                        <StyledBadge
                            overlap="circle"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                        >
                            <Avatar style={{
                                width: 50,
                                height: 50,
                                fontSize: 40
                            }}>{user && user.name.substr(0, 1).toLocaleUpperCase()}</Avatar>
                        </StyledBadge>
                        <Typography className={classes.typography}><AssignmentIcon
                            className={classes.icon}/>{user && user.name}</Typography>
                        <Typography className={classes.typography}><EmailIcon
                            className={classes.icon}/>{user && user.email}</Typography>
                        <Typography className={classes.typography}><WcIcon
                            className={classes.icon}/>
                            {
                                languagePackage[lang][user ? user.sex : 'unknown']
                            }
                        </Typography>
                    </Paper>
                </Card>
            </Grid>
        </Fade>
    )
})

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