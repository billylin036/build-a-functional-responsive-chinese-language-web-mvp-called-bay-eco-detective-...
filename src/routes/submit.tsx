import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { tasks, getTask } from "@/data/tasks";
import { locations, getLocation } from "@/data/locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppState } from "@/lib/app-state";

const searchSchema = z.object({ task: z.string().optional() });

export const Route = createFileRoute("/submit")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "提交观察记录 | 湾区生态侦探" },
      {
        name: "description",
        content: "上传你在深圳湾看到的红树林、水色或岸线情况，审核后用于生态保护与公众科普。",
      },
      { property: "og:title", content: "提交观察记录 | 湾区生态侦探" },
      { property: "og:description", content: "一张带时间地点的照片，也能成为长期生态比对的证据。" },
    ],
  }),
  component: SubmitPage,
});

const WATER_COLORS = ["清澈", "浅绿", "灰黄", "深黑/异常", "现场无水"];

function SubmitPage() {
  const { task: taskParam } = Route.useSearch();
  const navigate = useNavigate();
  const { addSubmission } = useAppState();

  const [taskId, setTaskId] = useState(taskParam ?? tasks[0]!.id);
  const currentTask = getTask(taskId);
  const [locationId, setLocationId] = useState(currentTask?.locationId ?? locations[0]!.id);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState(currentTask?.category ?? "红树林");
  const [description, setDescription] = useState("");
  const [waterColor, setWaterColor] = useState(WATER_COLORS[0]!);
  const [unusual, setUnusual] = useState("");
  const [contact, setContact] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto size-10 text-mangrove" />
        <h1 className="mt-4 text-xl font-semibold text-navy">提交成功</h1>
        <p className="mt-3 text-sm leading-7">
          感谢你的观察。这条记录将在审核后用于生态保护和公众科普。
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          未经审核的公众记录不会作为经过验证的科学结论发布。
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild>
            <Link to="/me">查看我的记录</Link>
          </Button>
          <Button variant="outline" onClick={() => setDone(false)}>
            再提交一条
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-navy">提交公众观察记录</h1>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        请如实填写。所有记录都会经过机构审核，不会直接作为监测结论发布。
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!description.trim()) {
            setError("请填写简要描述，让审核人员知道你看到了什么。");
            return;
          }
          if (!agree) {
            setError("请勾选真实性与隐私确认后再提交。");
            return;
          }
          setError("");
          addSubmission({
            taskId,
            locationId,
            date,
            category,
            description: description.trim(),
            waterColor,
            unusual: unusual.trim(),
            contact: contact.trim(),
            photoName,
          });
          toast.success("感谢你的观察，记录已提交待审核。");
          setDone(true);
        }}
      >
        <Field label="选择任务">
          <select
            className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
            value={taskId}
            onChange={(e) => {
              setTaskId(e.target.value);
              const t = getTask(e.target.value);
              if (t) {
                setLocationId(t.locationId);
                setCategory(t.category);
              }
            }}
          >
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="观察地点"
          hint={`已根据任务自动选择：${getLocation(locationId)?.name ?? ""}，也可手动更改`}
        >
          <select
            className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          >
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="观察日期">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="观察类别">
            <select
              className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {["红树林", "水环境", "生物多样性", "岸线", "科普"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="上传照片" hint="演示环境仅记录文件名，不会上传到服务器">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? "")}
          />
          {photoName && <p className="mt-1 text-xs text-muted-foreground">已选择：{photoName}</p>}
        </Field>

        <Field label="水色 / 现场环境状况">
          <div className="flex flex-wrap gap-2">
            {WATER_COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setWaterColor(c)}
                aria-pressed={waterColor === c}
                className={`rounded-sm border px-3 py-1.5 text-xs ${
                  waterColor === c ? "border-teal bg-paleeco" : "border-border bg-card"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Field>

        <Field label="简要描述">
          <Textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例如：退潮后靠步道一侧的幼苗有明显缺株，滩面有塑料瓶堆积。"
          />
        </Field>

        <Field label="你注意到什么异常吗？" hint="选填">
          <Textarea
            rows={2}
            value={unusual}
            onChange={(e) => setUnusual(e.target.value)}
            placeholder="例如：非降雨时段排口有大量灰白色出水并伴有异味。"
          />
        </Field>

        <Field label="联系方式" hint="选填，仅用于必要时的记录核实">
          <Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="邮箱或手机号" />
        </Field>

        <label className="flex items-start gap-2 text-sm leading-6">
          <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} className="mt-1" />
          <span>
            我确认以上内容为本人真实观察，并同意机构在脱敏后将其用于生态保护与公众科普。
          </span>
        </label>

        {error && (
          <p role="alert" className="rounded-md border border-destructive/40 bg-card px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <Button type="submit">提交观察记录</Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/tasks" })}>
            返回任务列表
          </Button>
        </div>
      </form>
    </main>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-sm font-medium text-navy">{label}</Label>
      {hint && <p className="mb-1 mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
