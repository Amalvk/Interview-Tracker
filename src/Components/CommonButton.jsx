import { Button, Box } from "@mui/material";

function CommonButton({ label, handleClick, value, variant, color, bg, borderColor, sx, icon }) {
    return (
        <Box textAlign="right">
            <Button
                size="small"
                variant={variant}
                onClick={() => handleClick(value)}
                sx={{
                    mt: 2,
                    pr: 1,
                    textTransform: "capitalize",
                    height: 20,
                    fontSize: "0.7rem",
                    color: color,
                    background: bg,
                    borderColor: borderColor,
                    fontWeight: variant === "outlined" ? 600 : "normal",
                    ...sx,
                }}
            >
                {label} {icon}
            </Button>
        </Box>
    );
}

export default CommonButton;
