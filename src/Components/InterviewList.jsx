import { Box, MenuItem, Select, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { format } from "date-fns";
import { updateInterviewStatus } from "../Redux/formSlice";
import Snackbar from "@mui/material/Snackbar";
import CommonButton from "./CommonButton";
import ConfirmWarningModal from "./ConfirmWarningModal";
import { ACTIONS_COLUMN_WIDTH, actionsColumnSx } from "./cardLayout";

function getNotesForDisplay({ commentList, comments }) {
  if (Array.isArray(commentList) && commentList.length) {
    return [...commentList].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }
  if (comments) {
    return [{ id: "legacy", text: String(comments), createdAt: null }];
  }
  return [];
}

function formatNoteDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : format(d, "MMM d, yyyy");
}

function InterviewList(props) {
  const {
    id,
    companyName,
    position,
    applicationDate,
    skills,
    initialStatus,
    contactNumber,
    commentList,
    comments,
    contactName,
    handleUpdate,
  } = props;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [contactVia, setContactVia] = useState("");
  const notes = useMemo(
    () => getNotesForDisplay({ commentList, comments }),
    [commentList, comments],
  );
  const dispatch = useDispatch();

  const handleStatusChange = (newStatus) => {
    dispatch(updateInterviewStatus({ id, newStatus }));
    setSnackbarOpen(true);
  };

  const handleDeclineClick = () => {
    setConfirmOpen(true);
  };

  const confirmDecline = () => {
    handleStatusChange(6);
  };

  const handleCall = (mobile) => {
    window.location.href = `tel:${mobile}`;
  };

  const handleWhatsApp = (mobile) => {
    const digits = String(mobile || "").replace(/\D/g, "");
    if (!digits) return;
    window.open(`https://wa.me/${digits}`, "_blank", "noopener,noreferrer");
  };

  const handleContactViaChange = (e) => {
    const method = e.target.value;
    if (method === "call") handleCall(contactNumber);
    if (method === "whatsapp") handleWhatsApp(contactNumber);
    setContactVia("");
  };

  return (
    <Box
      key={id}
      sx={{
        width: "100%",
        maxWidth: "100%",
        borderRadius: 2,
        boxShadow: 2,
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: 6,
          cursor: "pointer",
        },
      }}
    >
      <Box
        onClick={() => handleUpdate(props)}
        sx={{
          background: "#fff",
          mt: 3,
          p: "20px 10px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          width: "100%",
          boxSizing: "border-box",
          borderRadius: 2,
          boxShadow: 2,
          transition: "box-shadow 0.3s ease",
          cursor: "pointer",
          "&:hover": {
            boxShadow: 8,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            width: "100%",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0, fontSize: 13 }}>
            <Box fontSize={15} fontWeight={600}>
              {companyName}
            </Box>
            <Box color={"#ba9e9e"} fontWeight={600}>
              {" "}
              {position}{" "}
            </Box>
            <Box pt={0.5}>
              {" "}
              Contact :{" "}
              <span style={{ fontWeight: 600 }}>{contactNumber}</span>{" "}
            </Box>

            {contactName && (
              <Box>
                HR Name : <span style={{ fontWeight: 600 }}>{contactName}</span>
              </Box>
            )}

            {skills && (
              <Box>
                Skills : <span style={{ fontWeight: 600 }}>{skills}</span>
              </Box>
            )}
          </Box>
          <Box onClick={(e) => e.stopPropagation()} sx={actionsColumnSx}>
            <Select
              value={initialStatus}
              onChange={(e) => {
                handleStatusChange(e.target.value);
              }}
              size="small"
              fullWidth
              sx={{ fontSize: "0.7rem", height: 25 }}
            >
              <MenuItem sx={{ fontSize: "10px" }} value={1}>
                Applied
              </MenuItem>
              <MenuItem sx={{ fontSize: "10px" }} value={2}>
                HR Round
              </MenuItem>
              <MenuItem sx={{ fontSize: "10px" }} value={3}>
                Technical Round
              </MenuItem>
              <MenuItem sx={{ fontSize: "10px" }} value={4}>
                Management Round
              </MenuItem>
              <MenuItem sx={{ fontSize: "10px" }} value={5}>
                Offer Received
              </MenuItem>
            </Select>

            <Select
              displayEmpty
              value={contactVia}
              onChange={handleContactViaChange}
              size="small"
              fullWidth
              sx={{ fontSize: "0.7rem", height: 25, mt: 2 }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    p: 0.5,
                    bgcolor: "#f5f5f5",
                    minWidth: ACTIONS_COLUMN_WIDTH,
                    maxWidth: ACTIONS_COLUMN_WIDTH,
                  },
                },
              }}
              renderValue={(selected) => {
                if (selected === "call") {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                      }}
                    >
                      <PhoneIcon sx={{ fontSize: 14 }} />
                      Call
                    </Box>
                  );
                }
                if (selected === "whatsapp") {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                      }}
                    >
                      <WhatsAppIcon sx={{ fontSize: 14 }} />
                      WhatsApp
                    </Box>
                  );
                }
                return "Contact via";
              }}
            >
              <MenuItem
                value="call"
                sx={{
                  fontSize: "10px",
                  bgcolor: "#22348c",
                  color: "#fff",
                  mb: 0.5,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#1a2a70" },
                  "&.Mui-selected": { bgcolor: "#22348c", color: "#fff" },
                  "&.Mui-selected:hover": { bgcolor: "#1a2a70" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <PhoneIcon sx={{ fontSize: 14 }} />
                  Call
                </Box>
              </MenuItem>
              <MenuItem
                value="whatsapp"
                sx={{
                  fontSize: "10px",
                  bgcolor: "#18ad4f",
                  color: "#fff",
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#149643" },
                  "&.Mui-selected": { bgcolor: "#18ad4f", color: "#fff" },
                  "&.Mui-selected:hover": { bgcolor: "#149643" },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <WhatsAppIcon sx={{ fontSize: 14 }} />
                  WhatsApp
                </Box>
              </MenuItem>
            </Select>

            <Box textAlign={"right"} sx={{ width: "100%" }}>
              <CommonButton
                label="Decline"
                variant="outlined"
                color="red"
                borderColor="#e29e55"
                handleClick={handleDeclineClick}
                sx={{ width: "100%" }}
              />
            </Box>
          </Box>
        </Box>

        {notes.length > 0 && (
          <Box
            sx={{
              width: "100%",
              alignSelf: "stretch",
              boxSizing: "border-box",
            }}
          >
            <Typography fontWeight={600} fontSize={12} color="text.secondary">
              Notes
            </Typography>
            {notes.map((n) => (
              <Box
                key={n.id}
                sx={{
                  mt: 0.5,
                  pl: 1,
                  width: "100%",
                  maxWidth: "100%",
                  borderLeft: "2px solid #e0e0e0",
                  boxSizing: "border-box",
                }}
              >
                {n.createdAt && (
                  <Typography
                    component="div"
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: 12, mb: 0.25, display: "block" }}
                  >
                    {formatNoteDate(n.createdAt)}
                  </Typography>
                )}
                <Typography
                  component="div"
                  sx={{
                    fontSize: 12,
                    display: "block",
                    width: "100%",
                    maxWidth: "100%",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {n.text}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Box
          sx={{
            fontSize: 10,
            fontWeight: 600,
            color: "#a3acad",
            width: "100%",
          }}
        >
          Date : {applicationDate}
        </Box>
      </Box>

      <ConfirmWarningModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDecline}
        title="Decline interview?"
        message={`Move "${companyName}" to the declined list? You can reactivate it later from Uncracked.`}
        confirmLabel="Decline"
        cancelLabel="Cancel"
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={`${companyName}'s interview status changed !!`}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}

export default InterviewList;
