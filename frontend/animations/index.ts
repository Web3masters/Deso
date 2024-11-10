import { Variants } from "framer-motion";

export const loginBgVariant: Variants = {
    start: {
        rotate: 2,
        opacity: 0,
        filter: "blur(5px)"
    },
    end: {
        rotate: 0,
        opacity: 1,
        filter: "none",
        transition: {
            delay: 3,
            duration: 2,
        }
    },
}

export const loginSloganVariant: Variants = {
    start: {
        y: "10vh",
        scale: 1.3,
    },
    end: {
        y: 0,
        scale: 1,
        transition: {
            delay: 2.5,
            duration: 1.5,
        }
    },
}
export const loginButtonVariant: Variants = {
    start: {
        opacity: 0,
    },
    end: {
        opacity: 1,
        transition: {
            delay: 5,
            duration: 1,
        }
    },
}
export const signupContainerVariant: Variants = {
    start: {
        opacity: 0,
    },
    end: {
        opacity: 1,
        transition: {
            delay: 0.5,
            duration: 1,
        }
    },
}

export const loginSloganVariants: Variants = {
    start: {
        y: "8vh",
        scale: 1.5,
    },
    end: {
        y: 0,
        scale: 1.3,
        transition: {
            delay: 1,
            duration: 1.5,
        }
    },
}
export const loginButtonVariants: Variants = {
    start: {
        opacity: 0,
        y: "-7vh",
        scale: 1,
    },
    end: {
        opacity: 1,
        scale: 1,
        y:0,
        transition: {
            delay: 2.6,
            duration: 1,
        }
    },
}
export const loginLineVariants: Variants = {
    start: {
        opacity: 0,

    },
    end: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 2.5,
            duration: 0.5,
        }
    },
}