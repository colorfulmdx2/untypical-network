import React, {useState} from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {
    Avatar,
    Button,
    ButtonGroup,
    Checkbox,
    Fab,
    FormControlLabel,
    Grow,
    Menu,
    MenuItem,
    Switch
} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {AppStateType} from "../../redux/store";
import {login, logOut, setDarkMod, setLanguage, setMaleOnly} from '../../redux/reducer'
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Alert from '@material-ui/lab/Alert';
import {blue, grey} from "@material-ui/core/colors";
import {AddUserModal} from "../modal/AddUserModal";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
        title: {
            cursor: 'pointer'
        },

        sectionDesktop: {
            display: 'flex',
            [theme.breakpoints.up('sm')]: {
                display: 'flex',

            },
        },
        sectionMobile: {
            display: 'flex',
            [theme.breakpoints.up('md')]: {},
        },
        fabButton: {
            position: 'absolute',
            zIndex: 1,
            bottom: -45,
            left: 0,
            right: 0,
            margin: '0 auto',

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
        selected: {
            color: blue[500],
            backgroundColor: grey[900]
        },
        buttons: {
            position: 'absolute',
            bottom: -50,
            left: 6
        }
    }),
);

export const Header = React.memo(() => {

    const dispatch = useDispatch()
    const classes = useStyles();
    const history = useHistory()

    const [open, setOpen] = useState(false)
    const [info, setInfo] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

    const {user, auth, lang, languagePackage, darkMode, maleOnly} = useSelector<AppStateType, any>(state => state.reducer)

    const handleModalClose = () => {
        setOpen(false);
    };
    const handleModalOpen = () => {
        setOpen(true);
    };

    const handleClick = (e: any) => {
        setAnchorEl(e.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const darkModeOnChange = () => {
        dispatch(setDarkMod({value: !darkMode}))
    }
    const maleOnlyHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       dispatch(setMaleOnly({value: event.target.checked}))
    }

    const addUserHandler = () => {
        if (!auth) {
            setInfo(true)
        } else {
            handleModalOpen()
        }
    }


    return (
        <Grow in={true}>
            <div className={classes.grow}>
                <Grow in={info}>
                    <Alert className={classes.alert}
                           severity="info"
                           onClose={() => setInfo(false)}
                    >{languagePackage[lang].notification}</Alert>
                </Grow>

                <AddUserModal isOpen={open}
                              handleClose={handleModalClose}
                              handleOpen={handleModalOpen}
                />

                <AppBar position="static">
                    <Toolbar>

                        <Typography className={classes.title} variant="h6" noWrap onClick={() => history.push('/')}>
                            Users
                        </Typography>

                        <ButtonGroup className={classes.buttons} variant="text" color="primary"
                                     aria-label="text primary button group">
                            <Button className={lang === 'ru' ? classes.selected : ''}
                                    onClick={() => dispatch(setLanguage({value: 'ru'}))}>ru</Button>

                            <Button className={lang === 'en' ? classes.selected : ''}
                                    onClick={() => dispatch(setLanguage({value: 'en'}))}>en</Button>
                        </ButtonGroup>

                        <div className={classes.grow}/>
                        <Grow in={true}>
                            <Fab color="secondary"
                                 aria-label="add"
                                 className={classes.fabButton}
                                 onClick={addUserHandler}
                            >
                                <PersonAddIcon/>
                            </Fab>
                        </Grow>
                        <div className={classes.sectionDesktop}>
                            <FormControlLabel
                                value="Male"
                                control={<Checkbox onChange={maleOnlyHandleChange} value={maleOnly} color="secondary"/>}
                                label="Male"
                                labelPlacement="start"
                                style={{marginRight: 10}}
                            />
                            <FormControlLabel label={languagePackage[lang].darkMode}
                                              control={
                                                  <Switch checked={darkMode}
                                                          onChange={darkModeOnChange}
                                                          color={"secondary"}
                                                  />
                                              }
                            />

                            {
                                user ? <div>
                                        <Avatar src={user.photoURL}
                                                onClick={handleClick}
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    cursor: 'pointer',
                                                    margin: '9px 0px 0px 7px'
                                                }}/>
                                        <Menu
                                            style={{top: '45px'}}
                                            id="simple-menu"
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >
                                            <MenuItem
                                                onClick={() => dispatch(logOut())}>{languagePackage[lang].logOut}</MenuItem>
                                        </Menu>
                                    </div>
                                    : <Button
                                        onClick={() => dispatch(login())}
                                        startIcon={<PermIdentityIcon/>}
                                    >
                                        {languagePackage[lang].login}
                                    </Button>

                            }

                        </div>

                    </Toolbar>
                </AppBar>
            </div>
        </Grow>
    )
        ;
})
