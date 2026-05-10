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
  recruiterCode: string;

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
    recruiterCode: "",

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (
    role: "recruiter" | "candidate"
  ) => {
    setFormData({
      ...formData,
      role,
      recruiterCode:
        role === "recruiter"
          ? formData.recruiterCode
          : "",
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // Recruiter code validation
    if (
      formData.role === "recruiter" &&
      formData.recruiterCode !== "1604"
    ) {
      toast.error("Invalid Recruiter Access Code");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        activeTab === "signup"
          ? "/api/auth/register"
          : "/api/auth/login";

      const body =
        activeTab === "signup"
          ? formData
          : {
              email: formData.email,
              password: formData.password,
              role: formData.role,
              recruiterCode:
                formData.recruiterCode,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(
          data.error || "Action failed"
        );
        return;
      }

      login(data.user);

      toast.success(
        `Welcome ${data.user.name}!`
      );

      closeLoginModal();

      setTimeout(() => {
        if (
          data.user.role === "recruiter"
        ) {
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
            setActiveTab(
              value as "signin" | "signup"
            )
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">
              Sign Up
            </TabsTrigger>

            <TabsTrigger value="signin">
              Sign In
            </TabsTrigger>
          </TabsList>

          {/* SIGN UP */}
          <TabsContent
            value="signup"
            className="mt-6 space-y-4"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="signup-name">
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
                <Label htmlFor="signup-email">
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
                <Label htmlFor="signup-password">
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

              {/* RECRUITER CODE */}
              <div className="space-y-2">
                <Label htmlFor="signup-recruiterCode">
                  Recruiter Access Code
                </Label>

                <Input
                  id="signup-recruiterCode"
                  name="recruiterCode"
                  type="password"
                  placeholder="Enter recruiter code"
                  value={formData.recruiterCode}
                  onChange={handleInputChange}
                  required={
                    formData.role === "recruiter"
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="male">
                    Male
                  </option>

                  <option value="female">
                    Female
                  </option>

                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Role</Label>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={
                      formData.role ===
                      "recruiter"
                        ? "default"
                        : "outline"
                    }
                    className="flex-1"
                    onClick={() =>
                      handleRoleChange(
                        "recruiter"
                      )
                    }
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Recruiter
                  </Button>

                  <Button
                    type="button"
                    variant={
                      formData.role ===
                      "candidate"
                        ? "default"
                        : "outline"
                    }
                    className="flex-1"
                    onClick={() =>
                      handleRoleChange(
                        "candidate"
                      )
                    }
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
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </Button>
            </form>
          </TabsContent>

          {/* SIGN IN */}
          <TabsContent
            value="signin"
            className="mt-6 space-y-4"
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="signin-email">
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
                <Label htmlFor="signin-password">
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

              {/* RECRUITER CODE */}
              <div className="space-y-2">
                <Label htmlFor="signin-recruiterCode">
                  Recruiter Access Code
                </Label>

                <Input
                  id="signin-recruiterCode"
                  name="recruiterCode"
                  type="password"
                  placeholder="Enter recruiter code"
                  value={formData.recruiterCode}
                  onChange={handleInputChange}
                  required={
                    formData.role === "recruiter"
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>

                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={
                      formData.role ===
                      "recruiter"
                        ? "default"
                        : "outline"
                    }
                    className="flex-1"
                    onClick={() =>
                      handleRoleChange(
                        "recruiter"
                      )
                    }
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Recruiter
                  </Button>

                  <Button
                    type="button"
                    variant={
                      formData.role ===
                      "candidate"
                        ? "default"
                        : "outline"
                    }
                    className="flex-1"
                    onClick={() =>
                      handleRoleChange(
                        "candidate"
                      )
                    }
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
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;