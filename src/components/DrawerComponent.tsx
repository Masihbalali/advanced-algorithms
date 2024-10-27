'use client';
import React, { useState } from "react";
import {
    Drawer,
    Button,
    Typography,
    IconButton,
    List,
    ListItem,
    Collapse,
} from "@material-tailwind/react";
import Link from "next/link";
// import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const lists = [
    {
        path: "/pso",
        label: "Pso",
    },
    {
        path: "/firefly",
        label: "Psfireflyo",
        children: [
            {
                path: "/firefly",
                label: "Psfireflyo",
            },
            {
                path: "/firefly/document",
                label: "Psfireflyo ",
            },
            // Add more nested items here if needed
        ],
    },
    {
        path: "/dev",
        label: "Dev",
    },
    {
        path: "/bat",
        label: "bat",
        children: [
            {
                path: "/bat",
                label: "bat",
            },
            {
                path: "/bat/document",
                label: "bat doc ",
            },
            // Add more nested items here if needed
        ],
    },
    {
        path: "/cuckoo",
        label: "cuckoo",
    },
    {
        path: "/ica",
        label: "ica",
    },
    {
        path: "/genetic",
        label: "genetic",
    },
    {
        path: "/wolf",
        label: "Wolf",
        children: [
            {
                path: "/wolf",
                label: "Wolf EXAMPLE",
            },
            {
                path: "/wolf/document",
                label: "Wolf Document",
            },
            // Add more nested items here if needed
        ],
    },
    // Add more main items and their children as needed
];

export function DrawerComponent() {
    const [open, setOpen] = useState(false);
    const [openItems, setOpenItems] = useState({});

    const toggleDrawer = () => setOpen(!open);

    const toggleItem = (label) => {
        setOpenItems((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    const closeDrawer = () => setOpen(false);

    const renderListItems = (items, level = 0) => {
        return items.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openItems[item.label];

            return (
                <div key={item.label}>
                    <ListItem
                        onClick={() => hasChildren && toggleItem(item.label)}
                        className={`flex justify-between items-center cursor-pointer pl-${level * 4} py-2`}
                    >
                        {hasChildren ? (
                            <span>{item.label}</span>
                        ) : (
                            <Link href={item.path} onClick={closeDrawer} className="w-full">
                                {item.label}
                            </Link>
                        )}
                        {hasChildren && (
                            isOpen ? (
                                // <ChevronDownIcon className="h-5 w-5" />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                                </svg>


                            ) : (
                                // <ChevronRightIcon className="h-5 w-5" />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            )
                        )}
                    </ListItem>
                    {hasChildren && (
                        <Collapse open={isOpen}>
                            <List className="pl-4">
                                {renderListItems(item.children, level + 1)}
                            </List>
                        </Collapse>
                    )}
                </div>
            );
        });
    };

    return (
        <React.Fragment>
            <Button onClick={toggleDrawer}>Lists</Button>
            <Drawer open={open} onClose={closeDrawer} className="bg-gray-100">
                <div className="mb-2 flex items-center justify-between p-4">
                    <Typography variant="h5" color="blue-gray">
                        Algorithms Lists
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
                    {renderListItems(lists)}
                </List>
            </Drawer>
        </React.Fragment>
    );
}
