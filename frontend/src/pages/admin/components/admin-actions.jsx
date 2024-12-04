import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, FileText, Settings, Bell, BarChart, Users, ShoppingCart, Mail, Shield, Database, Cloud, Code, Globe, Camera, Headphones, Printer, Wifi, Zap, Briefcase, Coffee, Compass, Feather, Heart, Map } from 'lucide-react'
import { useNavigate } from "react-router-dom"


const actions = [
  { title: "Users", description: "Manage All Users", icon: UserPlus, path: "/deleteUser" },
  { title: "Admins", description: "Manage Admins", icon: FileText, path: "/admin/addAdmin" },
  { title: "Tourism Governors", description: "Manage Tourism Governors", icon: Settings, path: "/admin/addTourismGovernor" },
  { title: "Activity Categories", description: "Manage Activity Categories", icon: Bell, path: "/admin/EditActivityCategories" },
  { title: "Preference Tags", description: "Manage Preference Tags", icon: BarChart, path: "/preferenceTag"},
  { title: "Products", description: "Manage Products", icon: Users, path: "/product" },
  { title: "Complaints", description: "Manage Complaints", icon: ShoppingCart, path: "/viewComplaints" },
  { title: "Itineraries", description: "Manage Itineraries", icon: Mail, path: "/admin/itineraries" },
  { title: "Pending Users", description: "Manage Pending Users", icon: Shield, path: "/admin/pending-users" },
  { title: "Account Deletion Requests", description: "Manage Account Deletion Requests", icon: UserPlus, path: "/deleteAccount" },
  { title: "Activities", description: "Manage Activities", icon: Database, path: "/admin/manage-activities" },
  { title: "Promo Codes", description: "Manage Promo Codes", icon: Cloud, path: "/" },
]


export default function AdminActions({ currentPage, setCurrentPage }) {
  const actionsPerPage = 6;
  const totalPages = Math.ceil(actions.length / actionsPerPage);
  const startIndex = (currentPage - 1) * actionsPerPage;
  const endIndex = startIndex + actionsPerPage;
  const currentActions = actions.slice(startIndex, endIndex);
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Actions</CardTitle>
        <CardDescription>Quick actions for system management</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentActions.map((action, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{action.title}</CardTitle>
                <action.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {/* <p className="text-xs text-muted-foreground">{action.description}</p> */}
                <Button className="mt-4 w-full" onClick={() => navigate(action.path)}>{action.description}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-6 space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}



{/* <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Change Password
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Update your account security
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  Change Password
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            <Card> */}
          //   {isPasswordModalOpen && (
          //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          //       <div className="bg-white rounded-lg p-6 w-full max-w-md">
          //         <div className="flex justify-between items-center mb-4">
          //           <h2 className="text-xl font-bold">Change Password</h2>
          //           <button
          //             onClick={() => setIsPasswordModalOpen(false)}
          //             className="text-gray-500 hover:text-gray-700"
          //           >
          //             <X className="h-6 w-6" />
          //           </button>
          //         </div>
          //         <div className="mb-4">
          //           <label
          //             htmlFor="currentPassword"
          //             className="block text-sm font-medium text-gray-700 mb-1"
          //           >
          //             Current Password
          //           </label>
          //           <div className="relative">
          //             <Input
          //               type={showCurrentPassword ? "text" : "password"}
          //               id="currentPassword"
          //               value={currentPassword}
          //               onChange={(e) => setCurrentPassword(e.target.value)}
          //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          //               required
          //             />
          //             <button
          //               type="button"
          //               className="absolute inset-y-0 right-0 pr-3 flex items-center"
          //               onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          //             >
          //               {showCurrentPassword ? (
          //                 <EyeOff className="h-5 w-5 text-gray-400" />
          //               ) : (
          //                 <Eye className="h-5 w-5 text-gray-400" />
          //               )}
          //             </button>
          //           </div>
          //         </div>
          //         <div className="mb-4">
          //           <label
          //             htmlFor="newPassword"
          //             className="block text-sm font-medium text-gray-700 mb-1"
          //           >
          //             New Password
          //           </label>
          //           <div className="relative">
          //             <input
          //               type={showNewPassword ? "text" : "password"}
          //               id="newPassword"
          //               value={newPassword}
          //               onChange={(e) => setNewPassword(e.target.value)}
          //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          //               required
          //             />
          //             <button
          //               type="button"
          //               className="absolute inset-y-0 right-0 pr-3 flex items-center"
          //               onClick={() => setShowNewPassword(!showNewPassword)}
          //             >
          //               {showNewPassword ? (
          //                 <EyeOff className="h-5 w-5 text-gray-400" />
          //               ) : (
          //                 <Eye className="h-5 w-5 text-gray-400" />
          //               )}
          //             </button>
          //           </div>
          //         </div>
          //         <div className="mb-6">
          //           <label
          //             htmlFor="confirmPassword"
          //             className="block text-sm font-medium text-gray-700 mb-1"
          //           >
          //             Confirm New Password
          //           </label>
          //           <div className="relative">
          //             <input
          //               type={showConfirmPassword ? "text" : "password"}
          //               id="confirmPassword"
          //               value={confirmPassword}
          //               onChange={(e) => setConfirmPassword(e.target.value)}
          //               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          //               required
          //             />
          //             <button
          //               type="button"
          //               className="absolute inset-y-0 right-0 pr-3 flex items-center"
          //               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          //             >
          //               {showConfirmPassword ? (
          //                 <EyeOff className="h-5 w-5 text-gray-400" />
          //               ) : (
          //                 <Eye className="h-5 w-5 text-gray-400" />
          //               )}
          //             </button>
          //           </div>
          //         </div>
          //         {error && <p className="text-red-500 mb-4">{error}</p>}
          //         <div className="flex justify-end">
          //           <button
          //             type="button"
          //             onClick={() => setIsPasswordModalOpen(false)}
          //             className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          //           >
          //             Cancel
          //           </button>
          //           <button
          //             onClick={handlePasswordChange}
          //             type="submit"
          //             className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          //           >
          //             Change Password
          //           </button>
          //         </div>
          //       </div>
          //     </div>
          //   )}
          // </div>
          

          // const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
          // const [currentPassword, setCurrentPassword] = useState("");
          // const [newPassword, setNewPassword] = useState("");
          // const [confirmPassword, setConfirmPassword] = useState("");
          // const [showCurrentPassword, setShowCurrentPassword] = useState(false);
          // const [showNewPassword, setShowNewPassword] = useState(false);
          // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
          // const [error, setError] = useState("");
