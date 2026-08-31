# Thamar Financial Hub

ابنِ منصة MVP مالية باسم thamar اعتمادًا على تصميمي Figma المرفق كمرجع رئيسي للهوية البصرية والألوان وتخطيط العناصر والأسلوب: https://www.figma.com/design/8i8C2Z07UgP7FrotLOKqL5/thamar?node-id=3-2&t=UGbj35Z7uhawF7id-1 و https://www.figma.com/file/8i8C2Z07UgP7FrotLOKqL5?node-id=0:1&locale=en&type=design. طبّق واجهة قريبة قدر الإمكان من التصميم. اللغة الافتراضية العربية RTL مع دعم الإنجليزية LTR وزر تبديل واضح. أنشئ صفحة بداية/تسجيل دخول وفق التصميم مع رابط ظاهر لسياسة الخصوصية. أنشئ Dashboard تعرض الدخل الشهري، المصروفات، المدخرات، صندوق الطوارئ، المبلغ المراد استثماره، معدل الادخار، ومؤشر الاستدامة المالية. أضف رسوم بيانية تجريبية واضحة: رسم للمؤشرات الداخلية الشخصية (دخل، مصروفات، ادخار، صندوق طوارئ، وأصول/توزيع عند وجوده)، رسم لاتجاهات السوق (ذهب، أسهم، بيتكوين، نفط) خلال فترة مناسبة، ورسم مقارنة فرص الاستثمار والعائد التقديري للذهب والأسهم والبيتكوين والنفط مع إبراز الأكثر ملاءمة. أضف قسم مؤشرات خارجية يشمل الذهب والأسهم والبيتكوين والنفط والتضخم والفائدة، قيم تجريبية واتجاهات. تحت الرسوم، أضف بطاقات توصية استثمارية لكل خيار: الاسم، الملاءمة من 100، المخاطر، العائد التقديري، سبب موجز، وإبراز الأفضل حاليًا. اجعل التوصيات صراحةً متأثرة مستقبلاً بالبيانات الشخصية والسوقية معًا وليس بسعر الأصل فقط. أضف تنبيه استثماري ظاهر بأن المؤشرات تقديرية/استرشادية وليست ضمانًا أو توصية استثمارية مؤكدة. استخدم بيانات تجريبية فقط ولا تطلب هوية أو حساب بنكي أو بطاقات أو كلمات مرور. هيكل التطبيق يجب أن يكون جاهزًا لربط API حقيقي لاحقًا، مع عدم إضافة مفاتيح API أو أسرار للكود. يمكن الاستلهام من OpenBB Widgets Library لطريقة العرض فقط. لا تبنِ ميزات خارج الـMVP. تحقق من الواجهة وجودة التجاوب قبل الإنهاء.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://thamar-financial-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b45debae-6fbb-44db-95d5-cfcdd02e0c5e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
