"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  User as UserIcon,
  Briefcase,
  UserCheck,
  Phone,
  MapPin,
  GraduationCap,
  DollarSign,
} from "lucide-react";

interface FormData {
  name: string;
  email: string;
  password: string;
  gender: string;
  role: "recruiter" | "candidate";
  age: string;
  phone: string;
  workAvailability: string;
  skills: string;
  location: string;
  roleName: string;
  company: string;
  education: string;
  degreeSubject: string;
  salaryRange: string;
}

const LoginModal = () => {
  const {
    showLoginModal,
    openLoginModal,
    closeLoginModal,
    login,
  } = useAppStore();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    gender: "",
    role: "candidate",
    age: "",
    phone: "",
    workAvailability: "",
    skills: "",
    location: "",
    roleName: "",
    company: "",
    education: "",
    degreeSubject: "",
    salaryRange: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role: "recruiter" | "candidate") => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint =
        activeTab === "signup" ? "/api/auth/register" : "/api/auth/login";

      const body =
        activeTab === "signup"
          ? formData
          : {
            email: formData.email,
            password: formData.password,
            role: formData.role,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Action failed");
        return;
      }

      login(data.user);
      toast.success(`Welcome ${data.user.name}!`);
      closeLoginModal();

      setTimeout(() => {
        if (data.user.role === "recruiter") {
          router.replace("/dashboard");
        } else {
          router.replace("/candidate");
        }
      }, 100);

    } catch {
      toast.error("Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={showLoginModal}
      onOpenChange={(open) => {
        if (open) {
          openLoginModal();
        } else {
          closeLoginModal();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto overflow-x-hidden z-[100]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">
            RecruitFlow
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mb-6">
            AI-powered candidate filtering platform
          </DialogDescription>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(value: string) =>
            setActiveTab(value as "signin" | "signup")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
          </TabsList>

          {/* SIGN UP TAB */}
          <TabsContent value="signup" className="mt-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-sm font-medium">
                  <UserIcon className="inline mr-2 h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sm font-medium">
                  <Mail className="inline mr-2 h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-sm font-medium">
                  <Lock className="inline mr-2 h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Gender</Label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Role</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={formData.role === "recruiter" ? "default" : "outline"}
                    className="flex-1 p-3"
                    onClick={() => handleRoleChange("recruiter")}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Recruiter
                  </Button>
                  <Button
                    type="button"
                    variant={formData.role === "candidate" ? "default" : "outline"}
                    className="flex-1 p-3"
                    onClick={() => handleRoleChange("candidate")}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Candidate
                  </Button>
                </div>
              </div>

              {/* CANDIDATE ONLY FIELDS */}
              {formData.role === "candidate" && (
                <>
                  <div className="border-t border-border pt-4">
                    <p className="text-sm font-semibold text-primary mb-4">
                      Candidate Profile
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-age" className="text-sm font-medium">
                      Age
                    </Label>
                    <Input
                      id="signup-age"
                      name="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone" className="text-sm font-medium">
                      <Phone className="inline mr-2 h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Work Availability
                    </Label>
                    <select
                      name="workAvailability"
                      value={formData.workAvailability}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select Availability</option>
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-skills" className="text-sm font-medium">
                      Skills
                    </Label>
                    <Input
                      id="signup-skills"
                      name="skills"
                      type="text"
                      placeholder="React, Node.js, Python (comma separated)"
                      value={formData.skills}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-location" className="text-sm font-medium">
                      <MapPin className="inline mr-2 h-4 w-4" />
                      Location
                    </Label>
                    <Input
                      id="signup-location"
                      name="location"
                      type="text"
                      placeholder="New York, USA"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-roleName" className="text-sm font-medium">
                      <Briefcase className="inline mr-2 h-4 w-4" />
                      Current/Last Role
                    </Label>
                    <Input
                      id="signup-roleName"
                      name="roleName"
                      type="text"
                      placeholder="Software Engineer"
                      value={formData.roleName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-company" className="text-sm font-medium">
                      Current/Last Company
                    </Label>
                    <Input
                      id="signup-company"
                      name="company"
                      type="text"
                      placeholder="Google"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      <GraduationCap className="inline mr-2 h-4 w-4" />
                      Education Level
                    </Label>
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select Education</option>
                      <option value="high-school">High School</option>
                      <option value="associate">Associate Degree</option>
                      <option value="bachelor">Bachelor&apos;s Degree</option>
                      <option value="master">Master&apos;s Degree</option>
                      <option value="phd">PhD</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-degreeSubject" className="text-sm font-medium">
                      Degree Subject
                    </Label>
                    <Input
                      id="signup-degreeSubject"
                      name="degreeSubject"
                      type="text"
                      placeholder="Computer Science"
                      value={formData.degreeSubject}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-salaryRange" className="text-sm font-medium">
                      <DollarSign className="inline mr-2 h-4 w-4" />
                      Expected Salary Range
                    </Label>
                    <Input
                      id="signup-salaryRange"
                      name="salaryRange"
                      type="text"
                      placeholder="$60,000 - $80,000"
                      value={formData.salaryRange}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full h-12 font-semibold"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>

          {/* SIGN IN TAB */}
          <TabsContent value="signin" className="mt-6 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-sm font-medium">
                  <Mail className="inline mr-2 h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="signin-email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-sm font-medium">
                  <Lock className="inline mr-2 h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Role</Label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={formData.role === "recruiter" ? "default" : "outline"}
                    className="flex-1 p-3"
                    onClick={() => handleRoleChange("recruiter")}
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Recruiter
                  </Button>
                  <Button
                    type="button"
                    variant={formData.role === "candidate" ? "default" : "outline"}
                    className="flex-1 p-3"
                    onClick={() => handleRoleChange("candidate")}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Candidate
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 font-semibold"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;