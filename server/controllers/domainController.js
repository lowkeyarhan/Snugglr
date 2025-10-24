import AllowedDomain from "../models/alloweddomain.js";

// Get all allowed domains
export const getAllDomains = async (req, res) => {
  try {
    const { isActive } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const domains = await AllowedDomain.find(filter).sort({
      institutionName: 1,
    });

    res.status(200).json({
      success: true,
      count: domains.length,
      data: {
        domains,
      },
    });
  } catch (error) {
    console.error(`Error fetching allowed domains: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching allowed domains",
      error: error.message,
    });
  }
};

// Get a single domain by ID
export const getDomainById = async (req, res) => {
  try {
    const { id } = req.params;

    const domain = await AllowedDomain.findById(id);

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: "Domain not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        domain,
      },
    });
  } catch (error) {
    console.error(`Error fetching domain: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching domain",
      error: error.message,
    });
  }
};

// Add a new allowed domain
export const addDomain = async (req, res) => {
  try {
    const { domain, institutionName, isActive } = req.body;

    if (!domain || !institutionName) {
      return res.status(400).json({
        success: false,
        message: "Please provide domain and institution name",
      });
    }

    // Check if domain already exists
    const existingDomain = await AllowedDomain.findOne({
      domain: domain.toLowerCase(),
    });
    if (existingDomain) {
      return res.status(400).json({
        success: false,
        message: "This domain is already registered",
      });
    }

    const newDomain = await AllowedDomain.create({
      domain: domain.toLowerCase(),
      institutionName,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Domain added successfully",
      data: {
        domain: newDomain,
      },
    });
  } catch (error) {
    console.error(`Error adding domain: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error adding domain",
      error: error.message,
    });
  }
};

// Update a domain
export const updateDomain = async (req, res) => {
  try {
    const { id } = req.params;
    const { domain, institutionName, isActive } = req.body;

    const existingDomain = await AllowedDomain.findById(id);
    if (!existingDomain) {
      return res.status(404).json({
        success: false,
        message: "Domain not found",
      });
    }

    // If domain is being changed, check if new domain already exists
    if (domain && domain.toLowerCase() !== existingDomain.domain) {
      const duplicateDomain = await AllowedDomain.findOne({
        domain: domain.toLowerCase(),
        _id: { $ne: id },
      });
      if (duplicateDomain) {
        return res.status(400).json({
          success: false,
          message: "This domain is already registered",
        });
      }
    }

    const updateData = {};
    if (domain) updateData.domain = domain.toLowerCase();
    if (institutionName) updateData.institutionName = institutionName;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedDomain = await AllowedDomain.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Domain updated successfully",
      data: {
        domain: updatedDomain,
      },
    });
  } catch (error) {
    console.error(`Error updating domain: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error updating domain",
      error: error.message,
    });
  }
};

// Delete a domain
export const deleteDomain = async (req, res) => {
  try {
    const { id } = req.params;

    const domain = await AllowedDomain.findByIdAndDelete(id);

    if (!domain) {
      return res.status(404).json({
        success: false,
        message: "Domain not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Domain deleted successfully",
      data: {
        domain,
      },
    });
  } catch (error) {
    console.error(`Error deleting domain: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error deleting domain",
      error: error.message,
    });
  }
};

// Verify if an email domain is allowed
export const verifyEmailDomain = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email address",
      });
    }

    const emailDomain = email.split("@")[1]?.toLowerCase();

    if (!emailDomain) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
        isAllowed: false,
      });
    }

    const allowedDomain = await AllowedDomain.findOne({
      domain: emailDomain,
      isActive: true,
    });

    if (!allowedDomain) {
      return res.status(200).json({
        success: true,
        isAllowed: false,
        message: "Email domain is not in the allowed list",
      });
    }

    res.status(200).json({
      success: true,
      isAllowed: true,
      message: "Email domain is allowed",
      data: {
        domain: allowedDomain.domain,
        institutionName: allowedDomain.institutionName,
      },
    });
  } catch (error) {
    console.error(`Error verifying email domain: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error verifying email domain",
      error: error.message,
    });
  }
};
