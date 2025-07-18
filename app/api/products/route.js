import connectMongo from "@/lib/db";
import Product from "@/models/Product";
import slugify from "slugify";

//get all products
export async function GET() {
  await connectMongo();
  const allProducts = await Product.find().populate({path:'category'});

  return Response.json({ message: "Success!", products:allProducts }, { status: 200 });
}

//create product
export async function POST(req) {

  // const reqBody = await req.json();
  // console.log("Request Data", reqBody);
  await connectMongo();
  const formData = await req.formData();
  const data = Object.fromEntries(formData);
  const images = JSON.parse(data.images);

  const title = data.title.trim();
  const slug = slugify(title, { lower: true, strict: true });
  const price = data.price;
  const stock = data.stock;
  const description = data.description;
  const bestSeller = data.bestSeller;
  const showHero = data.showHero;
  const isFeatured = data.isFeatured === 'true';
  // console.log("data",title, price, stock, description,images  )
  console.log("isFeatured while creating",isFeatured  )
  // console.log("images:",images  )
  const existingProduct = await Product.findOne({ title: title.trim() });
  if (existingProduct) {
    return Response.json(
      { message: "A product with this title already exists." },
      { status: 409 } // 409 Conflict
    );
  }



  try {
    const newProduct = await Product.create({title,price,stock,description,images,bestSeller,showHero,slug, isFeatured })
    return Response.json({ message: "success!", product:newProduct }, { status: 200 })
  } catch (error) {
    return Response.json({ message: "Something went wrong!", error }, { status: 500 })
  }

//return Response.json({ message: "test!", }, { status: 200 })
  
}

//edit product
export async function PATCH(req) {

  await connectMongo();
  const formData = await req.formData();
  const data = Object.fromEntries(formData);
  console.log("data",data)
  const productId = data.productId;
  const images = JSON.parse(data.images);

  try {
    const product = await Product.findById(productId);
    if(!product){
      throw new Error("Product not found!")
    }

    product.title = data.title || product.title;
    let slug;
    if(data.title){
      slug = slugify(data.title, { lower: true, strict: true });
    }

    //console.log("isFeatured", data.isFeatured)
    product.price = data.price || product.price;
    product.description = data.description || product.description;
    product.stock = data.stock || product.stock;
    product.bestSeller = data.bestSeller || product.bestSeller;
    product.showHero = data.showHero || product.showHero;
    product.images = images || product.images;
    product.slug = slug || product.slug;
    product.isFeatured = data.isFeatured || product.isFeatured;
    product.quantity = data.quantity || product.quantity;
    product.category = data.category || product.category;
    product.weight = data.weight || product.weight;
    product.unit = data.unit || product.unit;



    const updatedProduct = await product.save();

    return Response.json({ message: "success!", product:updatedProduct }, { status: 200 })
  } catch (error) {
    console.log("Erorr on Edit:", error)
    return Response.json({ message: error.message, error }, { status: 500 })
  }
}

//delete product
export async function DELETE(req) {
  await connectMongo();
  const formData = await req.formData();
  const data = Object.fromEntries(formData);
  console.log("data",data)
  const productId = data.productId;


  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if(!deletedProduct){
      throw new Error("Product not found!")
    }

    return Response.json({ message: "deleted successfully!", product:deletedProduct }, { status: 200 })
  } catch (error) {
    return Response.json({ message: error.message, error }, { status: 500 })
  }
  


  return Response.json({ message: "PATCH route!" }, { status: 200 });
}


