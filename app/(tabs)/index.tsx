import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Toast } from "../../components/Toast";
import { UserCard } from "../../components/UserCard";
import { FilterState, UserFilter } from "../../components/UserFilter";
import { useAuth } from "../../contexts/AuthContext";
import {
  GetUnregisterdUsers,
  getUnregisteredUsers,
  sendWhatsAppMessage,
  updateFeedback,
} from "../../endpoints/users";
import { useToast } from "../../hooks/useToast";

interface User {
  id: number;
  name: string;
  mobile_no: number | null;
  instruction: string;
  status: string;
  feedback: string | null;
  assigned_to: string;
  tag: string | null;
  is_processed: boolean;
  created_at: string;
  updated_at: string;
  priority: string;
}

type TabType = "unregistered_user" | "matched_users" | "incomplete_user";

const TABS: {
  key: TabType;
  label: string;
}[] = [
  { key: "unregistered_user", label: "Unregistered" },
  { key: "matched_users", label: "Matched User" },
  { key: "incomplete_user", label: "Incomplete User" },
];
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("unregistered_user");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const setSelectedStatus = (status: string) => {
    console.log("🔄 setSelectedStatus called with:", status);
    console.trace("📍 Stack trace for setSelectedStatus");
    setSelectedStatusState(status);
  };
  const [selectedStatusState, setSelectedStatusState] = useState("");
  const [feedback, setFeedback] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const [loading, setLoading] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string>("ADMIN");
  const [showPhoneSelection, setShowPhoneSelection] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState<string>("");
  const [availablePhoneNumbers, setAvailablePhoneNumbers] = useState<string[]>([]);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { toast, showSuccess, showError, hideToast } = useToast();
  const { logout } = useAuth();

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (userInfo) {
        const parsedUser = JSON.parse(userInfo);
        const username = parsedUser.username || parsedUser.email;
        setLoggedInUser(username);
      } else {
        setLoggedInUser("ADMIN");
      }
    } catch (error) {
      console.error("Error loading user info:", error);
      setLoggedInUser("ADMIN");
    }
  };

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case "unregistered_user":
        return "person-add";
      case "matched_users":
        return "heart";
      case "incomplete_user":
        return "hourglass";
      default:
        return "ellipse";
    }
  };

  const getTabColor = (tab: TabType) => {
    switch (tab) {
      case "unregistered_user":
        return "#3b82f6";
      case "matched_users":
        return "#ec4899";
      case "incomplete_user":
        return "#f59e0b";
      default:
        return "#3b82f6";
    }
  };
  const fetchUsersByTab = async (tab: TabType) => {
    setLoading(true);
    setCurrentUser(null);
    try {
      let response;
      switch (tab) {
        case "unregistered_user":
          response = await getUnregisteredUsers(
            activeTab,
            selectedStatus,
            loggedInUser,
          );
          break;

        case "matched_users":
          response = await getUnregisteredUsers(
            activeTab,
            selectedStatus,
            loggedInUser,
          );
          break;

        case "incomplete_user":
          response = await getUnregisteredUsers(
            activeTab,
            selectedStatus,
            loggedInUser,
          );

          break;

        default:
          return;
      }
      console.log("Response Users=>", response);
      if (response?.users?.length) {
        setCurrentUser(response.users[0]);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      showError("Failed to load contact");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      // Only fetch when user explicitly requests it, not automatically
    };

    if (loggedInUser && activeTab) {
      // Remove automatic API calls - only call when user clicks buttons
    }
    fetchData();
  }, [loggedInUser, activeTab]);

  const fetchNextUser = async () => {
    if (!activeTab) return;
    const messageData = {
      phone_number: String(currentUser?.mobile_no),
      name: currentUser?.name,
      is_interested: selectedStatus == "Interested" ? 1 : 0,
    };
    setLoadingNext(true);
    try {
      await fetchUsersByTab(activeTab);
      if (
        selectedStatus == "Interested" ||
        selectedStatus == "Not Interested"
      ) {
        const response = await sendWhatsAppMessage(messageData);
        console.log("Whatsapp Response=>", response);
      }
      const response = await getUnregisteredUsers(
        activeTab,
        "pending",
        loggedInUser,
      );
      if (response?.users?.length) {
        setCurrentUser(response.users[0]);
      } else {
        setCurrentUser(null);
      }
      setSelectedStatus("");
    } finally {
      setLoadingNext(false);
    }
  };
  const handleSubmitFeedback = () => {
    console.log("🔍 handleSubmitFeedback called with selectedStatus:", selectedStatusState);
    
    if (!selectedStatusState) {
      console.log("❌ No status selected, showing error");
      showError("Please select a call status before proceeding");
      return;
    }
    
    console.log("✅ Status validated:", selectedStatusState);
    
    // Check if multiple phone numbers exist
    if (currentUser?.mobile_no) {
      const phoneNumbers = String(currentUser.mobile_no)
        .split(",")
        .map((phone) => phone.trim())
        .filter((phone) => phone);
      
      const uniquePhoneNumbers = Array.from(new Set(phoneNumbers));
      console.log("📞 Phone numbers found:", uniquePhoneNumbers);
      
      if (uniquePhoneNumbers.length > 1) {
        console.log("📱 Multiple numbers, showing phone selection");
        // Show phone selection modal
        setAvailablePhoneNumbers(uniquePhoneNumbers);
        setShowPhoneSelection(true);
        return;
      } else if (uniquePhoneNumbers.length === 1) {
        console.log("📱 Single number, auto-selecting:", uniquePhoneNumbers[0]);
        setSelectedPhoneNumber(uniquePhoneNumbers[0]);
      }
    }
    
    console.log("📝 Opening feedback modal with status:", selectedStatusState);
    setShowFeedbackModal(true);
  };
  const handleSkipFeedback = async () => {
    if (!selectedStatus) {
      showError("Please select a call status before proceeding");
      return;
    }
    
    try {
      if (currentUser) {
        await updateFeedback(
          currentUser.id,
          selectedStatusState,
          "Auto-skipped for " + selectedStatusState,
        );
      }
      
      showSuccess("Status saved successfully!");
      setSelectedStatus("");
      setLoadingNext(true);
      
      const response = await getUnregisteredUsers(
        activeTab,
        "pending",
        loggedInUser,
      );
      if (response?.users?.length) {
        setCurrentUser(response.users[0]);
      } else {
        setCurrentUser(null);
      }
      
      setLoadingNext(false);
    } catch (error) {
      console.error("Error updating feedback:", error);
      showError("Failed to save feedback. Please try again.");
    }
  };
  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      showError("Please enter feedback before proceeding");
      return;
    }

    if (!currentUser) {
      showError("No user selected");
      return;
    }

    if (!selectedStatusState) {
      showError("No status selected");
      return;
    }

    setSubmittingFeedback(true);
    try {
      console.log("Submitting feedback with:", {
        userId: currentUser.id,
        status: selectedStatusState,
        feedback: feedback,
        priority: currentUser.priority,
        selectedPhone: selectedPhoneNumber,
      });

      // 1️⃣ Call Feedback API
      await updateFeedback(
        currentUser.id,
        selectedStatusState,
        feedback,
        currentUser.priority,
      );
      console.log("✅ Feedback API called successfully");

      // 2️⃣ Send WhatsApp message for Interested/Not Interested status
      if (
        selectedStatusState === "Interested" ||
        selectedStatusState === "Not Interested"
      ) {
        const isInterested = selectedStatusState === "Interested" ? 1 : 0;

        if (selectedPhoneNumber) {
          const messageData = {
            phone_number: selectedPhoneNumber,
            name: currentUser.name,
            is_interested: isInterested,
          };

          await sendWhatsAppMessage(messageData);
          console.log(
            `✅ WhatsApp sent to ${selectedPhoneNumber} for status: ${selectedStatusState}`,
          );
        }
      }

      // 3️⃣ Fetch next user
      const response = await getUnregisteredUsers(
        activeTab,
        "pending",
        loggedInUser,
      );
      if (response?.users?.length) {
        setCurrentUser(response.users[0]);
      } else {
        setCurrentUser(null);
      }
      setFeedback("");
      setSelectedPhoneNumber("");
      setShowFeedbackModal(false);
      showSuccess("Status saved successfully!");
      // Reset status only after successful completion
      setSelectedStatus("");
      // Don't call fetchNextUser() here as it will reset status again
      setLoadingNext(true);
      // Fetch next user directly without calling fetchNextUser
      const nextResponse = await getUnregisteredUsers(
        activeTab,
        "pending",
        loggedInUser,
      );
      if (nextResponse?.users?.length) {
        setCurrentUser(nextResponse.users[0]);
      } else {
        setCurrentUser(null);
      }
      setLoadingNext(false);
    } catch (error) {
      console.log("Error updating feedback:", error);
      console.error("Error updating feedback:", error);
      showError("Failed to save feedback. Please try again.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleFetchAllUsers = async () => {
    setFetchingUsers(true);
    try {
      const response = await GetUnregisterdUsers({
        tag: activeTab,
        status: "pending",
        state: filters.state || undefined,
        city: filters.city || undefined,
        assigned_to: loggedInUser,
        auto_assign: true,
        current_user: loggedInUser,
        limit: 1,
        offset: 0,
      });
      console.log("Fetched users:", response);
      if (response?.users?.length) {
        setCurrentUser(response.users[0]);
      } else {
        setCurrentUser(null);
      }
      showSuccess(`Fetched ${response.users?.length || 0} users`);
    } catch (error: any) {
      showError(error.message || "Failed to fetch users");
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    const hasFilters = newFilters.state || newFilters.city || newFilters.status;
    showSuccess(
      hasFilters ? "Filters applied" : "No filters - using default API call",
    );
  };
  console.log("Current User=>", currentUser);
  console.log("🔍 Current selectedStatus:", selectedStatusState);
  return (
    <LinearGradient
      colors={
        isDark
          ? (["#0f172a", "#1e293b", "#334155"] as const)
          : (["#f0f9ff", "#e0f2fe", "#f8fafc"] as const)
      }
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <LinearGradient
            colors={["#3b82f6", "#8b5cf6"]}
            style={styles.titleIcon}
          >
            <Ionicons name="call" size={24} color="#ffffff" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text
              style={[styles.title, { color: isDark ? "#f8fafc" : "#0f172a" }]}
            >
              Calling Dashboard
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? "#94a3b8" : "#64748b" },
              ]}
            >
              {currentUser
                ? `Current: ${activeTab.replace("_", " ")}`
                : "No active user"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={logout}
            style={[
              styles.logoutButton,
              { backgroundColor: isDark ? "#374151" : "#f3f4f6" },
            ]}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={isDark ? "#f87171" : "#dc2626"}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContainer}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const tabColor = getTabColor(tab.key);

            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  {
                    backgroundColor: isActive
                      ? tabColor
                      : isDark
                        ? "#334155"
                        : "#f1f5f9",
                    borderColor: isActive ? tabColor : "transparent",
                  },
                ]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={getTabIcon(tab.key) as any}
                  size={16}
                  color={isActive ? "#ffffff" : isDark ? "#94a3b8" : "#64748b"}
                />
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive
                        ? "#ffffff"
                        : isDark
                          ? "#94a3b8"
                          : "#64748b",
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                borderWidth: 1,
                borderColor: isDark ? "#475569" : "#e2e8f0",
                shadowColor: isDark ? "#000" : "#3b82f6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 6,
              },
            ]}
            onPress={() => setShowFilter(true)}
          >
            <LinearGradient
              colors={["#6366f1", "#8b5cf6"]}
              style={styles.iconContainer}
            >
              <Ionicons name="filter" size={16} color="white" />
            </LinearGradient>
            <Text
              style={[
                styles.filterButtonText,
                { color: isDark ? "#f8fafc" : "#1e293b" },
              ]}
            >
              Filter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.fetchButton,
              { backgroundColor: getTabColor(activeTab) },
            ]}
            onPress={handleFetchAllUsers}
            disabled={fetchingUsers}
          >
            {fetchingUsers ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="download" size={16} color="white" />
                <Text style={styles.fetchButtonText}>Fetch Users</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {loadingNext && (
          <View
            style={[
              styles.progressContainer,
              { backgroundColor: getTabColor(activeTab) + "20" },
            ]}
          >
            <ActivityIndicator size="small" color={getTabColor(activeTab)} />
            <Text style={[styles.progress, { color: getTabColor(activeTab) }]}>
              Loading next contact...
            </Text>
          </View>
        )}
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <LinearGradient
            colors={[
              getTabColor(activeTab) + "20",
              getTabColor(activeTab) + "10",
            ]}
            style={styles.loadingCard}
          >
            <ActivityIndicator size="large" color={getTabColor(activeTab)} />
            <Text
              style={[
                styles.loadingText,
                { color: isDark ? "#94a3b8" : "#64748b" },
              ]}
            >
              Loading contacts...
            </Text>
          </LinearGradient>
        </View>
      )}

      {!loading && !currentUser && activeTab && (
        <View style={styles.emptyContainer}>
          <LinearGradient
            colors={[
              getTabColor(activeTab) + "20",
              getTabColor(activeTab) + "10",
            ]}
            style={styles.emptyCard}
          >
            <Ionicons
              name={getTabIcon(activeTab) as any}
              size={48}
              color={getTabColor(activeTab)}
            />
            <Text
              style={[
                styles.emptyTitle,
                { color: isDark ? "#f8fafc" : "#0f172a" },
              ]}
            >
              No Contacts Found
            </Text>
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? "#94a3b8" : "#64748b" },
              ]}
            >
              No {activeTab.replace("_", " ")} contacts available at the moment
            </Text>
          </LinearGradient>
        </View>
      )}

      {!loading && currentUser && (
        <UserCard
          user={currentUser}
          onSubmit={handleSubmitFeedback}
          onSkip={handleSkipFeedback}
          onNext={fetchNextUser}
          isDark={isDark}
          selectedStatus={selectedStatusState}
          onStatusChange={setSelectedStatus}
          isFirstUser={true}
          isLastUser={false}
          onFetchUsers={handleFetchAllUsers}
          onOpenFilters={() => setShowFilter(true)}
        />
      )}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />

      <Modal visible={showFeedbackModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={isDark ? ["#1e293b", "#334155"] : ["#ffffff", "#f8fafc"]}
            style={styles.feedbackModal}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? "#f8fafc" : "#0f172a" },
              ]}
            >
              📝 Add Feedback - {selectedStatusState}
            </Text>
            <TextInput
              style={[
                styles.feedbackInput,
                {
                  backgroundColor: isDark ? "#475569" : "#ffffff",
                  borderColor: isDark ? "#64748b" : "#e2e8f0",
                  color: isDark ? "#f8fafc" : "#0f172a",
                },
              ]}
              placeholder={`Enter feedback for ${selectedStatusState} status...`}
              placeholderTextColor={isDark ? "#94a3b8" : "#64748b"}
              value={feedback}
              onChangeText={setFeedback}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowFeedbackModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleFeedbackSubmit}
                disabled={submittingFeedback}
              >
                <LinearGradient
                  colors={["#3b82f6", "#1d4ed8"]}
                  style={[styles.modalButton, styles.submitButton]}
                >
                  {submittingFeedback ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Text style={styles.submitButtonText}>Submit</Text>
                      <Ionicons name="checkmark" size={16} color="white" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>

      {/* Phone Selection Modal */}
      <Modal visible={showPhoneSelection} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={isDark ? ["#1e293b", "#334155"] : ["#ffffff", "#f8fafc"]}
            style={styles.phoneSelectionModal}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? "#f8fafc" : "#0f172a" },
              ]}
            >
              📞 Select Phone Number
            </Text>
            <Text
              style={[
                styles.phoneSelectionSubtitle,
                { color: isDark ? "#94a3b8" : "#64748b" },
              ]}
            >
              Which number did you call?
            </Text>
            
            {availablePhoneNumbers.map((phone, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.phoneOption,
                  {
                    backgroundColor: isDark ? "#475569" : "#f1f5f9",
                    borderColor: isDark ? "#64748b" : "#e2e8f0",
                  },
                ]}
                onPress={() => {
                  setSelectedPhoneNumber(phone);
                  setShowPhoneSelection(false);
                  setShowFeedbackModal(true);
                }}
              >
                <Ionicons name="call" size={20} color={getTabColor(activeTab)} />
                <Text
                  style={[
                    styles.phoneOptionText,
                    { color: isDark ? "#f8fafc" : "#0f172a" },
                  ]}
                >
                  {phone}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={isDark ? "#94a3b8" : "#64748b"} />
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowPhoneSelection(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>

      <UserFilter
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApplyFilters={handleApplyFilters}
        currentFilters={filters}
        isDark={isDark}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  titleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },
  tabScrollContainer: {
    paddingHorizontal: 4,
    gap: 12,
    marginBottom: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    gap: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 12,
    gap: 12,
  },
  progress: {
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    minWidth: 200,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyCard: {
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    minWidth: 250,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  feedbackModal: {
    width: "100%",
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  feedbackInput: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#6b7280",
  },
  submitButton: {
    flexDirection: "row",
    gap: 8,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  cancelButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  phoneSelectionModal: {
    width: "100%",
    borderRadius: 16,
    padding: 24,
    maxHeight: "80%",
  },
  phoneSelectionSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  phoneOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  phoneOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fetchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    gap: 8,
  },
  fetchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 16,
    gap: 16,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 12,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  iconContainer: {
    borderRadius: 8,
    padding: 6,
  },
});
