'use client'
import React from "react";
import {
    Drawer,
    Button,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
} from "@material-tailwind/react";
import Link from "next/link";

const lists = [
    {
        path: "/pso",
        label: "Pso"
    },
    {
        path: "/firefly",
        label: "Psfireflyo"
    },
    {
        path: "/firefly",
        label: "Psfireflyo"
    },
    {
        path: "/dev",
        label: "dev"
    },
    {
        path: "/bat",
        label: "bat"
    },
    {
        path: "/wolf",
        label: "wolf"
    },
    {
        path: "/wolf/document",
        label: " wolf document"
    },
]


export function DrawerComponent() {
    const [open, setOpen] = React.useState(false);
    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    return (
        <React.Fragment>
            <Button onClick={openDrawer}>Lists</Button>
            <Drawer open={open} onClose={closeDrawer} className="bg-gray-100">
                <div className="mb-2 flex items-center justify-between p-4">
                    <Typography variant="h5" color="blue-gray">
                        Algorithms lists
                    </Typography>
                    <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </IconButton>
                </div>
                <List>

                    {lists.map(({ path, label }, index) => (
                        <Link key={index} href={path} onClick={closeDrawer}>
                            <ListItem>
                                {/* <ListItemPrefix>Algo</ListItemPrefix> */}
                                {label}
                            </ListItem>
                        </Link>
                    ))}

                </List>
                {/* <Button className="mt-3 ml-5" size="sm">
                    Documentation
                </Button> */}
            </Drawer>
        </React.Fragment>
    );
}