import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FavoriteIcon from "@mui/icons-material/Favorite";

const MyResources: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t("myResources.title")}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {t("myResources.description")}
      </Typography>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} mt={4}>
        <Box flex={1}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main" }} />
              <Typography variant="h6">{t("myResources.upload")}</Typography>
              <Button variant="contained" color="primary">
                {t("myResources.upload")}
              </Button>
            </Box>
          </Paper>
        </Box>
        <Box flex={1}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <FavoriteIcon sx={{ fontSize: 48, color: "secondary.main" }} />
              <Typography variant="h6">{t("myResources.favorites")}</Typography>
              <Button variant="contained" color="secondary">
                {t("myResources.favorites")}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default MyResources;
