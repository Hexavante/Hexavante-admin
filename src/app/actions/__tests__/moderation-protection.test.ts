import { beforeEach, expect, it, vi } from "vitest";
import { deleteUserByAdmin, unbanUser, unmuteUser } from "../moderation-users";
import { createImpersonation } from "@/services/web-session.service";
import { executeModerationCommand } from "@/services/moderation-admin.service";
const { db, login } = vi.hoisted(()=>({db:{
  user:{findUnique:vi.fn(),delete:vi.fn()},userRole:{findFirst:vi.fn(),findMany:vi.fn(),upsert:vi.fn(),deleteMany:vi.fn()},
  role:{findUnique:vi.fn()},session:{create:vi.fn()},moderationLog:{create:vi.fn()},
  userBan:{updateMany:vi.fn()},userMute:{updateMany:vi.fn()}
},login:vi.fn()}));
vi.mock("@/lib/admin-auth",()=>({getAdminSession:login}));
vi.mock("@/lib/prisma",()=>({prisma:{...db,$transaction:(work:(tx:typeof db)=>unknown)=>work(db)}}));
vi.mock("next/cache",()=>({revalidatePath:vi.fn()}));
beforeEach(()=>{vi.resetAllMocks();login.mockResolvedValue({id:"actor",roles:["MODERATOR"]});});
it.each(["/addcargo","/removecargo"])("bloqueia elevação no terminal %s",async cmd=>{
  db.user.findUnique.mockResolvedValue({id:"target",role:"user",roles:[]});
  db.userRole.findMany.mockResolvedValue([{role:{name:"MODERATOR"}}]);
  expect((await executeModerationCommand(cmd+" @target SUPERADMIN","actor",["MODERATOR"])).status).toBe("error");
  expect(db.userRole.upsert).not.toHaveBeenCalled(); expect(db.userRole.deleteMany).not.toHaveBeenCalled();
});
it.each([["user",[{role:{name:"SUPERADMIN"}}]],["superadmin",[]]])("protege a exclusão pelos dois registros",async(role,roles)=>{
  db.user.findUnique.mockResolvedValue({username:"target",role,roles});
  expect((await deleteUserByAdmin("target")).success).toBe(false);
  expect(db.user.delete).not.toHaveBeenCalled();
});
it("recusa as ações diretas de desbanir e retirar silêncio para moderadores",async()=>{
  expect((await unbanUser("target")).success).toBe(false);
  expect((await unmuteUser("target")).success).toBe(false);
  expect(db.user.findUnique).not.toHaveBeenCalled();
});
it("impede criar sessão como staff e permite uma conta comum ao superadmin",async()=>{
  db.userRole.findFirst.mockResolvedValue({userId:"actor"});
  db.user.findUnique.mockResolvedValueOnce({id:"target",role:"user",roles:[{role:{name:"ADMIN"}}]});
  await expect(createImpersonation("actor","target")).rejects.toThrow("staff");
  expect(db.session.create).not.toHaveBeenCalled();
  db.user.findUnique.mockResolvedValueOnce({id:"target",role:"user",roles:[]});
  await createImpersonation("actor","target");
  expect(db.session.create).toHaveBeenCalledWith({data:expect.objectContaining({userId:"target",impersonatedBy:"actor"})});
});
